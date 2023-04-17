import { AuthPage } from "@components/auth";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { mvAuthProvider } from "src/mvAuthProvider";

export default function Login() {
    return (
        <AuthPage
            type="login"
        />
    )
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated, redirectTo } = await mvAuthProvider.check(context);

    const translateProps = await serverSideTranslations(
        context.locale ?? "en",
        ["common"],
    );

    if (authenticated) {
        return {
            props: {},
            redirect: {
                destination: redirectTo ?? "/",
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

