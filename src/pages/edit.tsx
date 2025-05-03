import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import {
  User, Mail, Smartphone, Briefcase, Venus,
  GraduationCap, Upload, Loader2, CheckCircle, AlertTriangle
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';

interface CloudinaryFields {
  api_key: string;
  timestamp: string;
  public_id: string;
  signature: string;
  [key: string]: string;
}

interface EmployeeData {
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
  image: string;
}

const UpdateEmployeePage = () => {
  const { id: employeeId } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<EmployeeData>({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    image: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:8080/api/v1/employees/${employeeId}`, {
          withCredentials: true
        });

        setFormData({
          name: data.data.name,
          email: data.data.email,
          mobile: data.data.mobile,
          designation: data.data.designation,
          gender: data.data.gender,
          course: data.data.course,
          image: data.data.image
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          setErrorMessage(err.response?.data?.message || err.message);
        } else {
          setErrorMessage((err as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleChange = (field: keyof EmployeeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setUploadError(null);
  };

  const handleUploadImage = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const { data } = await axios.post('http://localhost:8080/api/v1/media/signed-url');
      const { url, fields, imageUrl } = data.data;

      const uploadForm = new FormData();
      const typedFields = fields as CloudinaryFields;
      
      uploadForm.append('api_key', typedFields.api_key);
      uploadForm.append('timestamp', typedFields.timestamp);
      uploadForm.append('public_id', typedFields.public_id);
      uploadForm.append('signature', typedFields.signature);
      
      Object.keys(typedFields).forEach(key => {
        if (!['api_key', 'timestamp', 'public_id', 'signature'].includes(key)) {
          uploadForm.append(key, String(typedFields[key]));
        }
      });
      
      uploadForm.append('file', file);

      await axios.post(url, uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      handleChange('image', imageUrl);
      
    } catch (err) {
      console.error('Upload error:', err);
      if (axios.isAxiosError(err)) {
        console.error('Response data:', err.response?.data);
      }
      setUploadError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const required = ['name', 'email', 'mobile', 'designation', 'gender', 'course', 'image'];
    const valid = required.every(f => formData[f as keyof typeof formData]?.trim());
    if (!valid) {
      setErrorMessage('Please fill all required fields and upload the image if changed.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await axios.patch(`http://localhost:8080/api/v1/employees/${employeeId}`, formData, {
        withCredentials: true
      });

      setSuccessMessage('Employee updated successfully!');
    } catch (err) {
      setErrorMessage(err instanceof AxiosError && err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          <span className="text-gray-100">Loading employee data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-16">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Update Employee</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-800 p-6 bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                    required
                  />
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 p-6 bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                  required
                >
                  <option value="">Select Designation</option>
                  {["HR", "Manager", "Sales", "Developer", "Accountant"].map(opt => (
                    <option key={opt} value={opt.toUpperCase()}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Venus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                  required
                >
                  <option value="">Select Gender</option>
                  {["Male", "Female", "Other"].map(opt => (
                    <option key={opt} value={opt.toUpperCase()}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-6 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                  required
                >
                  <option value="">Select Course</option>
                  {["MCA", "BCA", "BTECH", "MTECH", "MBA"].map(opt => (
                    <option key={opt} value={opt.toUpperCase()}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-300 w-full">
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span>{file ? file.name : 'Update Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>

                  {file && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload New Image'}
                    </button>
                  )}

                  {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-1">Current Image:</p>
                      <img
                        src={formData.image}
                        alt="Employee"
                        className="w-20 h-20 rounded object-cover"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Updating...
              </>
            ) : (
              "Update Employee"
            )}
          </button>

          {errorMessage && (
            <p className="text-red-400 flex items-center gap-2 justify-center mt-4">
              <AlertTriangle className="w-5 h-5" />
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-400 flex items-center gap-2 justify-center mt-4">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployeePage;