import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState();
  const loadResume = async () => {
    try {
      // First try to fetch as a public resume
      const { data } = await api.get("/api/resumes/public/" + resumeId);
      setResumeData(data.resume);
    } catch (error) {
      // If public fetch fails, and we have a token, try fetching as owner
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/api/resumes/get/" + resumeId, {
            headers: { Authorization: token },
          });
          setResumeData(data.resume);
        } catch (innerError) {
          console.log(innerError.message);
        }
      } else {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">
            Resume Not Found
          </p>
          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full
          px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Go to home page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
