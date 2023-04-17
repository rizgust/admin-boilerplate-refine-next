import React from "react";
import { AppProps } from "next/app";
import type { NextPage } from "next";
import { Refine, } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
    import { notificationProvider
,ThemedLayout
,RefineThemes} from '@refinedev/mantine';
import routerProvider, { UnsavedChangesNotifier } from "@refinedev/nextjs-router";

import restDataProvider from "@refinedev/simple-rest";
import graphqlDataProvider from "@refinedev/graphql";
import { dataProvider as mvDataProvider } from "@restDataProvider";
import { MantineProvider, Global, ColorScheme, ColorSchemeProvider} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { appWithTranslation, useTranslation } from "next-i18next";
import { Header } from "@components/header"
import { authProvider } from "src/authProvider";
import { GraphQLClient } from "@refinedev/graphql";

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

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
    const renderComponent = () => {
        if (Component.noLayout) {
            return <Component {...pageProps} />;
        }
            return (
                <ThemedLayout
                    Header={Header}
                >
                    <Component {...pageProps} />
                </ThemedLayout>
            );
    };

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
                key: "mantine-color-scheme",
                defaultValue: "light",
                getInitialValueInEffect: true,
            });
    const { t, i18n } = useTranslation();
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };
            
    return (
        <>
        <RefineKbarProvider>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                {/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
                <MantineProvider theme={{ ...RefineThemes.Blue, colorScheme:colorScheme }} withNormalizeCSS withGlobalStyles>
                    <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
                    <NotificationsProvider position="top-right">
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
                            {renderComponent()}
                            <RefineKbar />
                            <UnsavedChangesNotifier />
                        </Refine>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </RefineKbarProvider>
        </>
      );
};


export default appWithTranslation(MyApp);
