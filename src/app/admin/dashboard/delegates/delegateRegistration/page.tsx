"use client"
import { useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const DelegateRegistrationForm = () => {
    const [fName, setFName] = useState('')
    const [imageUrl, setImageUrl] = useState('');
    const [regNo, setRegNo] = useState('')
    const [faculty, setFaculty] = useState('')
    const [year, setYear] = useState('')
    const [department, setDepartment] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            fName,
            imageUrl,
            department,
            regNo,
            faculty,
            year: Number(year),
        };

        try {
            const response = await fetch('/api/delegates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            
            if (response.ok) {
                toast.success("Delegate registered successfully");
                router.push("/admin/dashboard/delegates");
            } else {
                toast.error('Error submitting delegate');
            }
        } catch (error) {
            console.log(error)
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md md:max-w-lg">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ) : (
                    <h2 className="text-2xl font-semibold text-blue-700 text-center mb-6">
                        Delegate Registration
                    </h2>
                )}

                <form onSubmit={(e)=>{
                    e.preventDefault();
                    handleSubmit()
                }} className="space-y-4">

                    <div>
                        <label htmlFor="full-name" className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            value={fName}
                            onChange={(e) => setFName(e.target.value)}
                            type="text"
                            id="full-name"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="student-id" className="block text-gray-700 text-sm font-bold mb-2">
                            Student ID
                        </label>
                        <input
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value)}


                            type="text"
                            id="student-id"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your student ID"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
                            Department
                        </label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            id="department"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled >
                                Select your department
                            </option>
                            <option value="computer-science">Computer Science</option>
                            <option value="electrical-engineering">Electrical Engineering</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="economics">Economics</option>
                        </select>
                    </div>


                    <div>
                        <label htmlFor="faculty" className="block text-gray-700 text-sm font-bold mb-2">
                            Faculty
                        </label>
                        <select
                            value={faculty}
                            onChange={(e) => setFaculty(e.target.value)}
                            id="faculty"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled >
                                Select your faculty
                            </option>
                            <option value="engineering">Faculty of Engineering</option>
                            <option value="science">Faculty of Science</option>
                            <option value="arts">Faculty of Arts and Social Sciences</option>
                            <option value="business">Faculty of Business and Economics</option>
                        </select>
                    </div>
                    {/* <div>
                        <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
                            Department
                        </label>
                        <select
                        value={faculty}
                        onChange={(e) => setDepar(e.target.value)}
                            id="department"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled >
                                Select your department
                            </option>
                            <option value="computer-science">Computer Science</option>
                            <option value="electrical-engineering">Electrical Engineering</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="economics">Economics</option>
                        </select>
                    </div> */}
                    <div>
                        <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
                            Year
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            id="department"
                            className="shadow appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="" disabled >
                                Select your year
                            </option>
                            <option value="1">1st</option>
                            <option value="2">2nd</option>
                            <option value="3">3rd</option>
                            <option value="4">4th</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="passport-photo" className="block text-gray-700 text-sm font-bold mb-2">
                            Passport Photograph
                        </label>
                        <div className="bg-blue-300 hover:bg-blue-400 text-gray-800 font-semibold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline">
                            <CldUploadWidget onSuccess={(results) => {
                                console.log('Public ID', results?.info?.public_id);
                                setImageUrl(results?.info?.secure_url);

                            }} uploadPreset="delegates">
                                {({ open }) => {
                                    return (
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            open();
                                        }}>
                                            Upload an Image
                                        </button>
                                    );
                                }}
                            </CldUploadWidget>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DelegateRegistrationForm;