import { MuiEditInferencer } from "@refinedev/inferencer/mui";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function BlogPostEdit() {
    return <MuiEditInferencer 
/>;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {

      const session = await getServerSession(
        context.req,
        context.res,
        authOptions,
    );
    

    const translateProps = await serverSideTranslations(
        context.locale ?? "en",
        ["common"],
    );

    if (!session) {
        return {
            props: {
                ...translateProps,
            },
            redirect: {
                destination: `/login?to=${encodeURIComponent("/blog-posts")}`,
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
