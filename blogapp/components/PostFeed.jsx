
import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
  console.log('posts', posts);
  
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div href={`/${post.username}/${post.slug}`}>
      <a>
        <h2>{post.title}</h2>
        <footer>
          <span>
            {wordCount} words. {minutesToRead} min read
          </span>
          <span>❤️ {post.heartCount || 0} Hearts</span>
        </footer>
      </a>
    </div>
  );
}