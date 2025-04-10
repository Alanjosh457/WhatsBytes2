"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { login } from '@/app/lib/services/auth'; // Adjust path as needed
import toast from "react-hot-toast";
import Image from "next/image";
import sky1 from "@/images/sky.png"; // Adjust path as needed
import cu1 from "@/images/cu.png"; // Adjust path as needed

const Login = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: null, password: null });

  const router = useRouter();

  const handleButtonClick = (button, path) => {
    setSelectedButton(button);
    router.push(path);
  };

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        return !value || !value.includes("@") || !value.includes(".") ? "Email is invalid" : null;
      case "password":
        return !value ? "Password is required" : null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    const error = validateField(id, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, [id]: error }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    let errorsExist = false;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        errorsExist = true;
      }
    });

    setFormErrors(newErrors);
    if (errorsExist) return;

    try {
      setLoading(true);
      const response = await login(formData);
      toast.success(response.message);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);

        // Removed the JWT decode and the related code
        // Instead, directly push the user to the dashboard
        router.push(`/dash`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <center>
        <form className={styles.form} onSubmit={handleClick}>
          <div className={styles.forms}>
            <div className={styles.field}>
              <input
                id="email"
                value={formData.email}
                type="text"
                placeholder="Email id"
                onChange={handleChange}
                className={styles.namer}
              />
              {formErrors.email && <p className={styles.error}>*{formErrors.email}</p>}
            </div>

            <div className={styles.field}>
              <input
                id="password"
                value={formData.password}
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className={styles.namer}
              />
              {formErrors.password && <p className={styles.error}>*{formErrors.password}</p>}
            </div>
          </div>
          <div className={styles.bns}>
            <button disabled={loading} type="submit" className={styles.regger}>
              {loading ? "Loading..." : "Login"}
            </button>

            <div className={styles.alr}>
              Don't have an account?
              <button className={styles.link} onClick={() => router.push("/register")}>SignUp</button>
            </div>
          </div>
        </form>
      </center>



      <div className={styles.cu2}>
        <Image src={cu1} alt="CU" className={styles.cu3} />
      </div>


    </>
  );
};

export default Login;
