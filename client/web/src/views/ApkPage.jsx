import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as routes from "../constants/routes";
import * as urls from "../constants/network";

const ApkPage = () => {
	const navigate = useNavigate();

	const handleDownload = () => {
		const url = process.env.PUBLIC_URL + urls.apkName;
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	useEffect(() => {
		handleDownload();
		navigate(routes.HOME_PAGE);
	}, []);

	return <div></div>;
};

export default ApkPage;
