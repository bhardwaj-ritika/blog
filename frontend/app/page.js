"use client"
import { useEffect, useState } from "react"

function Login() {
    const [data, setData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState({});
    const [form, setForm] = useState(false);
    const [submitted, setsubmitted] = useState({});

    const handleInputs = (e) => {
        const { name, value } = e.currentTarget;
        setData({ ...data, [name]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        let err = {}; // Empty object to store errors

        // Validate fields
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                err[key] = `${key} is required`;
            }
        });

        // If there are errors, set them and stop form submission
        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        } else {
            setError({}); // Clear errors when inputs are valid
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(data);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3001/login", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (!result.status) {
                    setError(result.errors || {});
                }
                if (result && result.status) {
                    const { params, headers, body } = result;
                    setsubmitted({
                        ...submitted,
                        params,
                        headers,
                        body
                    });
                    setForm(true);
                } else {
                    setForm(false);
                    setsubmitted({});
                }
            });
    }

    const back = () => {
        setForm(false);
        setsubmitted({});
        setData({ username: "", password: "" }); // Reset input fields
    }

    return (
        <div className="container mx-auto flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            {!form ? (
                <div>
                    <MyInput
                        id={"username"}
                        name={"username"}
                        type={"text"}
                        value={data.username}
                        onInput={handleInputs}
                        label={"Username"}
                    />
                    {error.username && <p className="text-red-500">{error.username}</p>}

                    <MyInput
                        id={"password"}
                        name={"password"}
                        type={"password"}
                        value={data.password}
                        onInput={handleInputs}
                        label={"Password"}
                    />
                    {error.password && <p className="text-red-500">{error.password}</p>}
                    <button onClick={submit} className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
                </div>
            ) : (
                <div className="border border-black w-60 text-center p-5 mt-10 mb-10">
                    <h1 className="text-xl font-bold">Welcome</h1>
                    <h2 className="text-lg">Admin</h2>
                    <button onClick={back} className="border border-black bg-black text-white pl-4 pr-4 pt-1 pb-1 mt-2">Log out</button>
                </div>
            )}
            <div>
                <ShowData data={data} />
                {form ? <p className="text-green-500">Login successful!</p> : <p className="text-red-500">{error.username || error.password ? "Login failed. Please check your credentials." : "Please enter your credentials."}</p>}
                <ShowForm submitted={submitted} />
            </div>
        </div>
    )
}

export default Login;

function MyInput(props) {
    const { id, name, type, value, onInput, label } = props;
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <input
                className="block w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                type={type}
                name={name}
                id={id}
                value={value}
                onInput={onInput}
                placeholder={label || name}
            />
        </div>
    );
}

const ShowData = ({ data }) => (
    <div>
        <h2 className="font-bold">Form Data</h2>
        <ul>
            {Object.keys(data).map((key, index) => (
                <li key={index}>{`${key} => ${data[key]}`}</li>
            ))}
        </ul>
    </div>
)

const ShowForm = ({ submitted }) => (
    <div>
        <h2 className="font-bold">Server Response</h2>
        <ul>
            {Object.entries(submitted).map(([key, value], index) => (
                <li key={index}>{`${key} => ${JSON.stringify(value)}`}</li>
            ))}
        </ul>
    </div>
)
