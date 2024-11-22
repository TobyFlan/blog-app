import Head from 'next/head';

export default function MetaTags({ title, description, image }) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {image && <meta property="twitter:image" content={image} />}
            {image && <meta property="twitter:card" content="summary_large_image" />}

            <meta name="twitter:site" content="@nextfireblogapp" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

        </Head>
    );
}