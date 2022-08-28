import Layout from "@components/layout";
import Tweets from "@components/tweets";
import Write from "@components/write";
import useUser from "@libs/client/useUser";

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <Layout title="Home">
      <Write />
      <Tweets />
    </Layout>
  );
}
