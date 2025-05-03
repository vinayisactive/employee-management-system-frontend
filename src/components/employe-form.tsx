import { useState, FormEvent, useEffect, ChangeEvent, useRef } from "react";
import {
  User,
  Mail,
  Smartphone,
  Briefcase,
  Venus,
  GraduationCap,
  Upload,
  Loader2,
} from "lucide-react";
import axios from "axios";
import _ from 'lodash';

type EmployeeFormProps = {
  mode: "create" | "edit";
  errorMessage: string | null;
  isSubmitting?: boolean;
  initialData?: Partial<{
    name: string;
    email: string;
    mobile: string;
    designation: string;
    gender: string;
    course: string;
    image: string | null;
  }> | null;
  onSubmit: (payload: {
    name: string;
    email: string;
    mobile: string;
    designation: string;
    gender: string;
    course: string;
    image: string | null;
  }) => void;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  mode,
  initialData = {},
  onSubmit,
  errorMessage,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: "",
    ...initialData,
  });

  const prevInitialDataRef = useRef(initialData);

useEffect(() => {
  const isEqual = _.isEqual(prevInitialDataRef.current, initialData);
  
  if (!isEqual) {
    setFormData(prev => ({
      ...prev,
      ...initialData,
    }));
    prevInitialDataRef.current = initialData;
  }
}, [initialData]);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "email",
      "mobile",
      "designation",
      "gender",
      "course",
    ];
    const isValid = requiredFields.every((field) =>
      Boolean(formData[field as keyof typeof formData]?.trim())
    );

    if (!isValid) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit({ ...formData, image: formData.image });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setUploadError(null);
      setIsUploading(true);

      const { data: uploadData } = await axios.post(
        "http://localhost:8080/api/v1/media/signed-url",
        {
          fileType: "IMAGE",
          fileName: selectedFile.name,
          contentType: selectedFile.type
        }
      );

      const { url, fields } = uploadData.data;
      const formData = new FormData();
      
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", selectedFile);

       await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = `${url}/${fields.key}`;
      handleChange("image", imageUrl);

    } catch (err) {
        console.log(err instanceof Error && err.message)
      setUploadError("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">
          {mode === "create" ? "Create new employee" : "Edit employee"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-800 p-6 bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">
              Personal Information
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    required
                  />
                </div>

                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 p-6 bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 appearance-none"
                  required
                >
                  <option value="">Select Designation</option>
                  {["HR", "Manager", "Sales", "Developer", "Accountant"].map(
                    (opt) => (
                      <option key={opt} value={opt.toUpperCase()}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="relative">
                <Venus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 appearance-none"
                  required
                >
                  <option value="">Select Gender</option>
                  {["Male", "Female", "Other"].map((opt) => (
                    <option key={opt} value={opt.toUpperCase()}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 appearance-none"
                  required
                >
                  <option value="">Select Course</option>
                  {["MCA", "BCA", "BTECH", "MTECH", "MBA"].map((opt) => (
                    <option key={opt} value={opt.toUpperCase()}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
            <div className="flex items-center gap-2">
              <label className={`flex items-center gap-1.5 text-sm font-medium text-gray-300 cursor-pointer 
                ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"} 
                px-3 py-1.5 rounded-lg border border-gray-600 transition-colors w-full`}>
                <Upload className="w-5 h-5 text-gray-400" />
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Uploading...
                  </span>
                ) : (
                  <span className="truncate max-w-[120px]">
                    {formData.image ? "Image uploaded" : "Upload Image"}
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  required={mode === "create" && !formData.image}
                />
              </label>
            </div>
            {uploadError && (
              <p className="text-red-400 text-sm mt-1">{uploadError}</p>
            )}
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-all font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : mode === "edit" ? (
              "Update Employee"
            ) : (
              "Create Employee"
            )}
          </button>

          {errorMessage && (
            <p className="font-semibold text-white text-center">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
