import React from "react";
import { useRouterContext, useLink, useRouterType } from "@refinedev/core";
import { Avatar, Link as MuiLink, SvgIcon, Typography } from "@mui/material";
import type { RefineLayoutThemedTitleProps } from "@refinedev/mui";

const defaultText = "MV-Project";
export const ThemedTitleV2: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
  text = defaultText,
}) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  return (
    <MuiLink
      to="/"
      component={ActiveLink}
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...wrapperStyles,
      }}
    >
      <Avatar
        alt="MV"
        src="https://static.wixstatic.com/media/863587_015fa98abb474cf19dad153721a061a0~mv2.png"
        sx={{ width: 56, height: 56 }}
        variant="square"
      />
      {/* <SvgIcon height="24px" width="24px" color="primary">
        {icon}
      </SvgIcon> */}
      {!collapsed && (
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          fontSize="inherit"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {text}
        </Typography>
      )}
    </MuiLink>
  );
};
