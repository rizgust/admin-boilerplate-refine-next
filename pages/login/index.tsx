import { useLogin } from "@refinedev/core";

import { Box, Button, Container, Typography } from "@mui/material";
    import { ThemedTitleV2 } from "@refinedev/mui";
    
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslate } from "@refinedev/core";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Login() {
    const { mutate: login } = useLogin();

    const t = useTranslate();

    
        return (
            <Container
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <Box
                display="flex"
                gap="36px"
                justifyContent="center"
                flexDirection="column"
            >
                <ThemedTitleV2
                collapsed={false}
                wrapperStyles={{
                    fontSize: "22px",
                    justifyContent: "center",
                }}
                />

                <Button style={{ width: "240px" }} variant="contained" size="large" onClick={() => login({})}>
                    {t("pages.login.signin", "Sign in")}
                </Button>
                <Typography align="center" color={"text.secondary"} fontSize="12px">
                Powered by
          <img
            style={{ padding: "0 5px" }}
            alt="Auth0"
            src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fauth0-2.svg"
          />
          Auth0
                </Typography>
            </Box>
            </Container>
        );



}

Login.noLayout = true;

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

    if (session) {
        return {
            props: {},
            redirect: {
                destination: "/",
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

