import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function PostContent({ post }) {

    const createdAt = new Date(post?.createdAt?.seconds * 1000).toLocaleDateString('en-UK');

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">{post?.title}</h1>
            <p className="text-sm">Written by @{post?.username} on {createdAt}</p>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    )


}