"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditDelegateForm() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState({
    fName: "",
    department: "",
    faculty: "",
    year: "",
    imageUrl: ""
  });

  useEffect(() => {
    const fetchDelegateData = async () => {
      try {
        const response = await fetch(`/api/delegates/${id}`);
        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDelegateData();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/delegates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Delegate updated successfully");
        router.push("/admin/dashboard/delegates");
      } else {
        toast.error('Error updating delegate');
      }

    } catch (error) {
      toast.error('Error updating delegate');
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit Delegate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fName">
            Full Name
          </label>
          <input
            id="fName"
            name="fName"
            type="text"
            value={form.fName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="department">
            Department
          </label>
          <input
            id="department"
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="faculty">
            Faculty
          </label>
          <input
            id="faculty"
            name="faculty"
            type="text"
            value={form.faculty}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Engineering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="year">
            Year
          </label>
          <input
            id="year"
            name="year"
            type="text"
            value={form.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Passport Photograph
          </label>
          <div className="bg-blue-300 hover:bg-blue-400 text-gray-800 font-semibold py-2 px-4 rounded-md inline-block cursor-pointer">
            <CldUploadWidget
              onSuccess={(results) => {
                console.log('Uploaded Image:', results?.info?.secure_url);
                setForm((prev) => ({
                  ...prev,
                  imageUrl: results?.info?.secure_url
                }));
              }}
              uploadPreset="delegates"
            >
              {({ open }) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                >
                  Upload an Image
                </button>
              )}
            </CldUploadWidget>
          </div>
          {form.imageUrl && (
            <Image
              src={form.imageUrl}
              alt="Uploaded"
              className="mt-2 w-32 h-32 object-cover rounded-md"
              width={128}
              height={128}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update Delegate
        </button>
      </form>
    </div>
  );
}
