/* eslint-disable react-hooks/exhaustive-deps */
import { signInWithPopup } from 'firebase/auth'
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import { auth, googleAuthProvider, db } from '../lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from '../lib/context'
import debounce from 'lodash.debounce'

interface User {
  uid: string
  photoURL: string
  displayName: string
  username: string
}

export default function Enter({}) {
  const { user, username } = useContext(UserContext) as { user: User | null; username: string | null }

  return (
    <main className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            {!user ? 'Sign in to get started' : !username ? 'Choose a username' : 'You\'re all set!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (!username ? <UsernameForm /> : <SignOutButton />) : <SignInButton />}
        </CardContent>
      </Card>
    </main>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider)
      console.log('Signed in with Google')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button onClick={signInWithGoogle} className="w-full">
      Sign in with Google
    </Button>
  )
}

function SignOutButton() {
  return (
    <Button onClick={() => auth.signOut()} variant="outline" className="w-full">
      Sign out
    </Button>
  )
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext) as { user: User | null; username: string | null }

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      console.error('User is null')
      return
    }
    const userDoc = doc(db, 'users', user.uid)
    const usernameDoc = doc(db, 'username', formValue)

    const batch = writeBatch(db)
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase()
    const regex = /^[a-zA-Z0-9_]*$/

    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (regex.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = doc(db, 'username', username)
        const docSnap = await getDoc(ref)
        const exists = docSnap.exists()
        console.log('Firestore read executed')
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  return (
    !username && (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Input
            name="username"
            placeholder="Username"
            value={formValue}
            onChange={onChange}
            className="w-full"
          />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
        </div>
        <Button type="submit" disabled={!isValid} className="w-full">
          Choose Username
        </Button>
      </form>
    )
  )
}

function UsernameMessage({ username, isValid, loading }: { username: string; isValid: boolean; loading: boolean }) {
  if (loading) {
    return <p className="text-sm text-muted-foreground mt-1">Checking...</p>
  } else if (isValid) {
    return <p className="text-sm text-green-600 mt-1">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-sm text-red-600 mt-1">That username is taken!</p>
  } else {
    return <p className="text-sm text-muted-foreground mt-1">Username must be at least 3 characters long.</p>
  }
}