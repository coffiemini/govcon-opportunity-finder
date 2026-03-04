export const metadata = {
title: "GovCon Opportunity Finder",
description: "Recompete-first lead generation platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body style={{ margin: 0, fontFamily: "Arial", background: "#0b1020", color: "#f2f5ff" }}>
{children}
</body>
</html>
);
}
