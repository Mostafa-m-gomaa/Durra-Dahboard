import "./request.css";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../App";

import { useParams } from "react-router-dom";
import ContentTop from "../ContentTop/ContentTop";
const RequestCard = () => {
  const { route, setLoader } = useContext(AppContext);
  const [request, setRequest] = useState({});
  const param = useParams();

  useEffect(() => {
    fetch(`${route}/${param.type}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let final = data.data.find((item) => item.id === param.id);
        setRequest(final);
      });
  }, []);
   (request);
  const bacLinks = [
    {
      name: "cv",
      link: request.CV,
    },
    {
      name: "High School Certificate",
      link: request.HighSchoolCertificate,
    },
    {
      name: "Passport",
      link: request.Passport,
    },
    {
      name: "Personal Picture",
      link: request.PersonalPicture,
    },
    {
      name: "Personal Statement",
      link: request.PersonalStatement,
    },
  ];
  const masterLinks = [
    ...bacLinks,
    {
      name: "Bachelors Degree Certificate With Transcript",
      link: request.BachelorsDegreeCertificateWithTranscript,
    },
    {
      name: "Experience Letter",
      link: request.ExperienceLetter,
    },
    {
      name: "English Test Results",
      link: request.EnglishTestResults,
    },
    {
      name: "Two Recommendation Letters",
      link: request.TwoRecommendationLetters,
    },
    {
      name: "Research Proposal",
      link: request.ResearchProposal,
    },
  ];
  const phdLinks = [
    ...masterLinks,
    {
      name: "Masters Degree Certificate With Transcript",
      link: request.MastersDegreeCertificateWithTranscript,
    },
  ];
  return (
    <div className="request-card">
      <ContentTop headTitle="Request Details" />

      <div className="container">
        <div className="details">
          <h2>Request Details</h2>
          <div className="req-details">
            <div>Country Of Study : {request.CountryOfStudy}</div>
            <div>
              Required Specialization : {request.RequiredSpecialization}
            </div>
            <div>Additional Service : {request.additionalService}</div>
            {param.type === "bachelor" && (
              <>
                {bacLinks.map((item, index) => (
                  <a
                    key={index}
                    href={`${item.link}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                ))}
              </>
            )}
            {param.type === "master" && (
              <>
                {masterLinks.map((item, index) => (
                  <a
                    key={index}
                    href={`${item.link}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                ))}
              </>
            )}
            {param.type === "phd" && (
              <>
                {phdLinks.map((item, index) => (
                  <a
                    key={index}
                    href={`${item.link}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                ))}
              </>
            )}
          </div>

          <h2>user details</h2>
          <div className="user-details">
            <div className="name">
              User Name : {request.UserDetails?.username}
            </div>
            <div className="name">
              User Email : {request.UserDetails?.email}
            </div>
            <div className="name">
              Request Type : {request.UserDetails?.type}
            </div>
          </div>
          <h2>Employee details</h2>
          <div className="user-details">
            <div>Employee Name : {request.Employee?.username}</div>
            <div>Employee Email : {request.Employee?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
