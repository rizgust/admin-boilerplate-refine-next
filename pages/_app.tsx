import React from "react";
import { AppProps } from "next/app";
import type { NextPage } from "next";
import { Refine, GitHubBanner, AuthBindings, } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { SessionProvider, useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
    import { ThemedLayoutV2, ThemedTitleV2, notificationProvider
,RefineSnackbarProvider} from '@refinedev/mui';
import routerProvider, { UnsavedChangesNotifier } from "@refinedev/nextjs-router";


import restDataProvider from "@refinedev/simple-rest";
import graphqlDataProvider, { GraphQLClient } from "@refinedev/graphql";
import { dataProvider as mvDataProvider } from "@restDataProvider";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { appWithTranslation, useTranslation } from "next-i18next";
import { ColorModeContextProvider } from "@contexts";
import { Header } from "@components/header";

const MV_API_URL = "https://api.fake-rest.refine.dev";
const REST_API_URL = "https://api.fake-rest.refine.dev";
const GRAPQL_API_URL = "https://your-graphql-url/graphql";
const grapQlClient = new GraphQLClient(GRAPQL_API_URL);



export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
     noLayout?: boolean;
 };

 type AppPropsWithLayout = AppProps & {
     Component: NextPageWithLayout;
 };

 const App = (props: React.PropsWithChildren) => {
    const { t, i18n } = useTranslation();
    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };
    
    const { data, status } = useSession();
    const router = useRouter();
    const { to } = router.query;
    if (status === "loading") {
        return <span>loading...</span>;
    }
    const authProvider: AuthBindings = {
        login: async () => {
            signIn("auth0", {
                    callbackUrl: to ? to.toString() : "/",
                    redirect: true,
                });

                return {
                    success: true,
                };
        },
        logout: async () => {
            signOut({
                redirect: true,
                callbackUrl: "/login",
            });

            return {
                success: true,
            };
        },
        onError: async (error) => {
            console.error(error);
            return {
                error,
            };
        },
        check: async () => {
            if (status === "unauthenticated") {
                return {
                    authenticated: false,
                    redirectTo: "/login",
                };
            }

            return {
                authenticated: true,
            };
        },
        getPermissions: async () => {
            return null;
        },
        getIdentity: async () => {
            if (data?.user) {
                const { user } = data;
                return {
                    name: user.name,
                    avatar: user.image,
                };
            }

            return null;
        },
    };

    return (
        <>
        <RefineKbarProvider>
            <ColorModeContextProvider>
                <CssBaseline />
                <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
                <RefineSnackbarProvider>
                    <Refine 
                        routerProvider={routerProvider}
                        dataProvider={{
                            default: mvDataProvider(MV_API_URL),
                            rest: restDataProvider(REST_API_URL),
                            graphql: graphqlDataProvider(grapQlClient)
                        }}
                        notificationProvider={notificationProvider}
                        authProvider={authProvider}
                        i18nProvider={i18nProvider}
                        resources={[
                            {
                                name: "blog_posts",
                                list: "/blog-posts",
                                create: "/blog-posts/create",
                                edit: "/blog-posts/edit/:id",
                                show: "/blog-posts/show/:id",
                                meta: {
                                    canDelete: true,
                                },
                            },
                            {
                                name: "categories",
                                list: "/categories",
                                create: "/categories/create",
                                edit: "/categories/edit/:id",
                                show: "/categories/show/:id",
                                meta: {
                                    canDelete: true,
                                },
                            }
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        {props.children}
                        <RefineKbar />
                        <UnsavedChangesNotifier />
                    </Refine>
                </RefineSnackbarProvider>
            </ColorModeContextProvider>
        </RefineKbarProvider>
        </>
      );
};


function MyApp({ Component, pageProps: { session, ...pageProps }, }: AppPropsWithLayout): JSX.Element {
    const renderComponent = () => {
        if (Component.noLayout) {
            return <Component {...pageProps} />;
        }

            return (
                <ThemedLayoutV2
                    Header={Header}
                >
                    <Component {...pageProps} />
                </ThemedLayoutV2>
            );
    };

    return (
        <SessionProvider session={session}>
            <App>{renderComponent()}</App>
        </SessionProvider>
    );
};


export default appWithTranslation(MyApp);
