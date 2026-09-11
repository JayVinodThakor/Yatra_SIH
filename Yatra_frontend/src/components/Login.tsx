// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect, useRef } from "react";
// import { Button, Input, message, Segmented } from "antd";
// import {
//   MobileOutlined,
//   MailOutlined,
//   ArrowRightOutlined,
//   ReloadOutlined,
//   CheckCircleFilled,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import { login } from "../utils/API";
// import { setUserConfig } from "../store/userConfigSlice";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { Lock } from "lucide-react";
// import Password from "antd/es/input/Password";

// const Login = () => {
//   const OTPLength = 4;
//   const ResendWait = 30;
//   const [method, setMethod] = useState("mobile");
//   const [email, setEmail] = useState<any>("");
//   const [password, setPassword] = useState<any>("");
//   const [showInput, setShowInput] = useState(true);
//   const [showOtp, setShowOtp] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [inputVal, setInputVal] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSeconds, setOtpSeconds] = useState(ResendWait);
//   const [loading, setLoading] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const otpInputs = useRef<any[]>([]);
//   const isMobile = method === "mobile";
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loginType = isMobile
//     ? `+91 ${inputVal.slice(0, 2)}****${inputVal.slice(-4)}`
//     : `${inputVal.slice(0, 2)}***@${inputVal.split("@")[1] || ""}`;

//   // resend timer
//   useEffect(() => {
//     if (!showOtp || otpSeconds <= 0) return;

//     const resendTimer = setTimeout(() => setOtpSeconds((s) => s - 1), 1000);
//     return () => clearTimeout(resendTimer);
//   }, [showOtp, otpSeconds]);

//   // validation
//   const validateInput = () =>
//     isMobile
//       ? /^[6-9]\d{9}$/.test(inputVal)
//       : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputVal);

//   // handlers
//   const handleMethodChange = (val: any) => {
//     setMethod(val);
//     goToInput();
//     setInputVal("");
//     setOtp("");
//   };

//   const handleSendOtp = async () => {
//     if (!validateInput()) {
//       message.error(
//         isMobile
//           ? "Enter a valid 10-digit mobile number"
//           : "Enter a valid email address",
//       );
//       return;
//     }
//     setLoading(true);
//     // await new Promise((res) => setTimeout(res, 1200));
//     setLoading(false);
//     setOtpSeconds(ResendWait);
//     goToOtp();
//     message.success(`OTP sent to ${loginType}`);
//   };

//   const handleVerifyOtp = async () => {
//     if (otp.length < OTPLength) {
//       message.error("Enter all 4 digits of the OTP");
//       return;
//     }
//     setVerifying(true);
//     // await new Promise((res) => setTimeout(res, 1400));
//     setVerifying(false);
//     if (otp === "1234") {
//       goToSuccess();
//     } else {
//       message.error("Incorrect OTP. Use 1234 for demo.");
//     }
//   };

//   const handleResend = async () => {
//     setOtp("");
//     setOtpSeconds(ResendWait);
//     // await new Promise((res) => setTimeout(res, 800));
//     message.success(`New OTP sent to ${loginType}`);
//   };

//   const handleBack = () => {
//     goToInput();
//     setOtp("");
//   };

//   const handleReset = () => {
//     goToInput();
//     setInputVal("");
//     setOtp("");
//   };

//   const otpVal = [...otp.split(""), ...Array(OTPLength).fill("")].slice(
//     0,
//     OTPLength,
//   );

//   const handleOtpChange = (e: any, i: number) => {
//     const char = e.target.value.replace(/\D/g, "").slice(-1);
//     const next = [...otpVal];
//     next[i] = char;
//     setOtp(next.join(""));
//     if (char && i < OTPLength - 1) otpInputs.current[i + 1]?.focus();
//   };

//   const handleOtpKey = (e: any, i: number) => {
//     if (e.key === "Backspace" && !otpVal[i] && i > 0)
//       otpInputs.current[i - 1]?.focus();
//   };

//   const goToInput = () => {
//     setShowInput(true);
//     setShowOtp(false);
//     setShowSuccess(false);
//   };

//   const goToOtp = () => {
//     setShowInput(false);
//     setShowOtp(true);
//     setShowSuccess(false);
//   };

//   const goToSuccess = () => {
//     setShowInput(false);
//     setShowOtp(false);
//     setShowSuccess(true);
//   };

//   const handleEmailLogin = async () => {
//     if (!email.trim()) {
//       message.error("Email is required.");
//     }

//     if (!password.trim()) {
//       message.error("Password is required.");
//     }

//     setLoading(true);
//     try {
//       const res = await login({
//         method: "email",
//         email,
//         password,
//       });

//       if (res.data.success) {
//         dispatch(
//           setUserConfig({
//             token: res.data.token,
//             permissions: res.data.permissions || [],
//             expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
//             ...res.data.user,
//           }),
//         );
//         message.success(res.data.message || "Login successfull");
//         navigate("/admin/dashboard");
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error: any) {
//       message.error(error.response?.data?.message || "Server Error");
//       // message.error("Network error. Please try again.", error);
//     } finally {
//       setLoading(false);
//     }
//     // login({ method: "email", email, password, }).then((res: any) => {
//     //   setLoading(false);
//     //   if (res.data.success) {
//     //     dispatch(
//     //       setUserConfig({
//     //         token: res.data.token,
//     //         permissions: res.data.permissions || [],
//     //         ...res.data.user,
//     //       }),
//     //     );
//     //     message.success(res.data.message || "Login successfull");
//     //     navigate("/admin/dashboard");
//     //   } else {
//     //     message.error(res.data.message);
//     //   }
//     // }).catch((err: any) => {
//     //   console.log("err", err.response);
//     //   setLoading(false);
//     //   if (err.response.status === 401) {
//     //     message.error(
//     //       err.response.data.result ||
//     //       err.response?.data?.message ||
//     //       "Unauthorized Access",
//     //     );
//     //   } else {
//     //     message.error(err.response?.data?.message || "Server Error");
//     //   }
//     // });
//   };

//   return (
//     <main className="min-h-screen flex justify-center items-center bg-linear-to-r from-[#0f2447] via-[#1a3a6b] to-[#0d47a1]">
//       <section className="flex items-center justify-center p-6">
//         <div className="w-full max-w-md">
//           {/* logo */}
//           <NavLink to={"/"}>
//             <div className="relative z-10 flex justify-center items-center gap-3 mb-4">
//               <div>
//                 <div className="text-white font-bold text-2xl leading-tight">
//                   CitizenConnect
//                 </div>
//                 <div className="text-blue-300 text-sm tracking-widest uppercase">
//                   Government Portal
//                 </div>
//               </div>
//             </div>
//           </NavLink>

//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="px-8 pt-8 border-b border-gray-100">
//               <h2 className="text-xl font-bold text-gray-800 mb-1">
//                 {showSuccess ? "Welcome back!" : "Sign in to your account"}
//               </h2>
//               <p className="text-sm text-gray-400">
//                 {/* {showInput && "Choose how you want to receive your OTP"} */}
//                 {showOtp && `Enter the 4-digit OTP sent to ${loginType}`}
//                 {showSuccess && "You have been verified successfully"}
//               </p>
//             </div>

//             <div className="px-8 py-7">
//               {showInput && (
//                 <div>
//                   <div className="mb-6">
//                     <Segmented
//                       block
//                       size="large"
//                       value={method}
//                       onChange={handleMethodChange}
//                       options={[
//                         {
//                           value: "mobile",
//                           label: (
//                             <span className="flex items-center justify-center gap-2 py-1">
//                               <MobileOutlined />
//                               <span>Mobile</span>
//                             </span>
//                           ),
//                         },
//                         {
//                           value: "email",
//                           label: (
//                             <span className="flex items-center justify-center gap-2 py-1">
//                               <MailOutlined />
//                               <span>Email</span>
//                             </span>
//                           ),
//                         },
//                       ]}
//                       style={{ borderRadius: 10 }}
//                     />
//                   </div>

//                   <div className="mb-5">
//                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
//                       {isMobile ? "Mobile Number" : "Email Address"}
//                     </label>
//                     {isMobile ? (
//                       <Input
//                         size="large"
//                         prefix={
//                           <span className="text-gray-400 mr-1 text-sm font-medium">
//                             +91
//                           </span>
//                         }
//                         placeholder="Enter 10-digit mobile number"
//                         value={inputVal}
//                         onChange={(e) =>
//                           setInputVal(
//                             e.target.value.replace(/\D/g, "").slice(0, 10),
//                           )
//                         }
//                         onPressEnter={handleSendOtp}
//                         maxLength={10}
//                         style={{ borderRadius: 10, height: 48 }}
//                       />
//                     ) : (
//                       <div className="flex flex-col gap-3">
//                         <Input
//                           size="large"
//                           prefix={
//                             <MailOutlined className="text-[#9ca3af]! mr-2" />
//                           }
//                           placeholder="Enter your email address"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           // onPressEnter={handleSendOtp}
//                           onPressEnter={handleEmailLogin}
//                           type="email"
//                           className="rounded-lg h-12"
//                           // style={{ borderRadius: 10, height: 48 }}
//                         />
//                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
//                           Password
//                         </label>
//                         <Password
//                           size="large"
//                           prefix={
//                             <Lock className="text-[#9ca3af] mr-2 w-5 h-5" />
//                           }
//                           placeholder="Enter your password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           // onPressEnter={handleSendOtp}
//                           onPressEnter={handleEmailLogin}
//                           type="password"
//                           className="rounded-lg h-12"
//                           // style={{ borderRadius: 10, height: 48 }}
//                         />
//                       </div>
//                     )}
//                     <p className="text-xs text-gray-400 mt-2!">
//                       {isMobile && "An OTP will be sent via SMS to this number"}
//                     </p>
//                   </div>

//                   {isMobile ? (
//                     <Button
//                       type="primary"
//                       size="large"
//                       block
//                       loading={loading}
//                       onClick={handleSendOtp}
//                       style={{
//                         background: "#1a3a6b",
//                         border: "none",
//                         borderRadius: 10,
//                         height: 48,
//                         fontWeight: 600,
//                         fontSize: 15,
//                       }}
//                     >
//                       {loading ? "Sending OTP…" : "Send OTP"}
//                     </Button>
//                   ) : (
//                     <Button
//                       type="primary"
//                       size="large"
//                       block
//                       loading={loading}
//                       onClick={handleEmailLogin}
//                       style={{
//                         background: "#1a3a6b",
//                         border: "none",
//                         borderRadius: 10,
//                         height: 48,
//                         fontWeight: 600,
//                         fontSize: 15,
//                       }}
//                     >
//                       {loading ? "Logging In" : "Login"}
//                     </Button>
//                   )}
//                 </div>
//               )}

//               {showOtp && (
//                 <div>
//                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
//                     <div className="text-blue-400 text-lg mt-0.5">
//                       {isMobile ? <MobileOutlined /> : <MailOutlined />}
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-blue-700 mb-0.5">
//                         OTP sent
//                       </p>
//                       <p className="text-sm text-blue-600">
//                         Check your {isMobile ? "messages" : "inbox"} at{" "}
//                         <span className="font-semibold">{loginType}</span>
//                       </p>
//                     </div>
//                   </div>

//                   <label className="text-xs font-semibold text-gray-500 tracking-wide mb-4 block text-center">
//                     Enter 4-digit OTP
//                   </label>
//                   <div
//                     className="flex gap-2 justify-center"
//                   >
//                     {otpVal.map((v, i) => (
//                       <input
//                         key={i}
//                         ref={(el: any) => (otpInputs.current[i] = el)}
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={1}
//                         value={v}
//                         disabled={verifying}
//                         onChange={(e) => handleOtpChange(e, i)}
//                         onKeyDown={(e) => handleOtpKey(e, i)}
//                         className={`
//                           text-center text-xl font-semibold border-2 rounded-lg outline-none transition-all
//                           ${v ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-200 bg-gray-50 text-gray-800"}
//                           focus:border-blue-500 focus:bg-white focus:shadow-lg
//                           disabled:opacity-50 disabled:cursor-not-allowed
//                         `}
//                         style={{ width: "44px", height: "52px" }}
//                       />
//                     ))}
//                   </div>

//                   <div className="text-center mt-3 mb-6">
//                     {otpSeconds > 0 ? (
//                       <span className="text-sm text-gray-400">
//                         Resend OTP in{" "}
//                         <span className="font-semibold text-gray-600">
//                           {otpSeconds}s
//                         </span>
//                       </span>
//                     ) : (
//                       <button
//                         onClick={handleResend}
//                         className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto cursor-pointer border-none bg-transparent"
//                       >
//                         <ReloadOutlined style={{ fontSize: 12 }} />
//                         Resend OTP
//                       </button>
//                     )}
//                   </div>

//                   <Button
//                     type="primary"
//                     size="large"
//                     block
//                     loading={verifying}
//                     onClick={handleVerifyOtp}
//                     disabled={otp.length < OTPLength}
//                     style={{
//                       background: "#1a3a6b",
//                       border: "none",
//                       borderRadius: 10,
//                       height: 48,
//                       fontWeight: 600,
//                       fontSize: 15,
//                       marginBottom: 12,
//                       color: "#fff",
//                     }}
//                   >
//                     {verifying ? "Verifying…" : "Verify & Sign In"}
//                   </Button>

//                   <button
//                     onClick={handleBack}
//                     className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer py-1"
//                   >
//                     <ArrowLeftOutlined /> Change {isMobile ? "number" : "email"}
//                   </button>

//                   <p className="text-center text-xs text-gray-300 mt-4">
//                     Demo: use OTP{" "}
//                     <span className="font-mono font-bold text-gray-400">
//                       1234
//                     </span>
//                   </p>
//                 </div>
//               )}

//               {showSuccess && (
//                 <div className="text-center py-4">
//                   <div className="flex justify-center mb-5">
//                     <CheckCircleFilled
//                       style={{ fontSize: 64, color: "#22c55e" }}
//                     />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                     Verification successful
//                   </h3>
//                   <p className="text-sm text-gray-400 mb-6">
//                     Logged in as{" "}
//                     <span className="font-medium text-gray-700">
//                       {loginType}
//                     </span>
//                   </p>
//                   <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 text-left">
//                     <p className="text-xs text-green-700 font-medium mb-1">
//                       Session active
//                     </p>
//                     <p className="text-sm text-green-800">
//                       You now have access to all CitizenConnect services. Your
//                       session is secured with end-to-end encryption.
//                     </p>
//                   </div>
//                   <Button
//                     type="primary"
//                     size="large"
//                     block
//                     onClick={handleReset}
//                     style={{
//                       background: "#1a3a6b",
//                       border: "none",
//                       borderRadius: 10,
//                       height: 48,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Go to Dashboard{" "}
//                     <ArrowRightOutlined className="w-6 h-6 mt-1" />
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
//               <p className="text-xs text-gray-400 text-center">
//                 By signing in, you agree to the{" "}
//                 <a href="#" className="text-blue-600 hover:underline">
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="text-blue-600 hover:underline">
//                   Privacy Policy
//                 </a>
//               </p>
//             </div>
//           </div>

//           <p className="relative flex justify-center items-center z-10 text-blue-400 text-xs mt-4!">
//             © 2026 Government of India
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Login;