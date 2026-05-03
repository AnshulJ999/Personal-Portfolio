import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formLink = process.env.GOOGLE_FORM_LINK;
  if (!formLink) {
    return new NextResponse("Please configure the env variables", {
      status: 500,
    });
  }

  // configure this according to your google form
  const fieldIdName = process.env.GOOGLE_FORM_FIELD_ID_NAME;
  const fieldIdEmail = process.env.GOOGLE_FORM_FIELD_ID_EMAIL;
  const fieldIdMessage = process.env.GOOGLE_FORM_FIELD_ID_MESSAGE;
  const fieldIdSocial = process.env.GOOGLE_FORM_FIELD_ID_SOCIAL;

  try {
    const body = await req.json();
    const { name, message, social, email } = body;

    const params = new URLSearchParams({
      ...(fieldIdName && { [fieldIdName]: name }),
      ...(fieldIdEmail && { [fieldIdEmail]: email }),
      ...(fieldIdMessage && { [fieldIdMessage]: message }),
      ...(fieldIdSocial && { [fieldIdSocial]: social ?? "" }),
    });

    const res = await fetch(`${formLink}/formResponse?${params.toString()}`);

    if (!res.ok) {
      console.log("Google Form submission failed:", res.status);
      return new NextResponse("Submission failed", { status: 502 });
    }

    return NextResponse.json("Success!");
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
