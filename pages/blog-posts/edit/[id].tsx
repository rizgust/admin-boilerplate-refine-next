import { MantineEditInferencer } from "@refinedev/inferencer/mantine";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


export default function BlogPostEdit() {
    return <MantineEditInferencer 
/>;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {

    
    const { authenticated, redirectTo } = await authProvider.check(context);

    const translateProps = await serverSideTranslations(
        context.locale ?? "en",
        ["common"],
    );


    if (!authenticated) {
        return {
            props: {
                ...translateProps,
            },
            redirect: {
                destination: `${redirectTo}?to=${encodeURIComponent(
          "/blog-posts"
        )}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            ...translateProps,
        },
    };
};
