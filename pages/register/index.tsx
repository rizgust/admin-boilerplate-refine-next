import { AuthPage } from "@components/pages/auth";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { mvAuthProvider } from "src/mvAuthProvider";

export default function Register() {
    return (
        <AuthPage
            type="register"
        />
    );
}

Register.noLayout = true;

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

