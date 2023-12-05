"use client";

import React from "react";

interface ProfileLinkProps {
	imgUrl: string;
	title: string;
	href?: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
	return <div>Profile Link</div>;
};

export default ProfileLink;
