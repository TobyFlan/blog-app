import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserProfile({ user }) {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user?.photoURL} alt={user?.username} />
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-bold">{user?.username}</CardTitle>
      </CardHeader>
      {/* <CardContent className="space-y-2">
        {user.bio && (
          <p className="text-sm">
            <span className="font-semibold">Bio:</span> {user.bio}
          </p>
        )}
      </CardContent> */}
    </Card>
  )
}