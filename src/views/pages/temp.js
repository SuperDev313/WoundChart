// ** React Import
import React, { useState } from "react";
import classnames from "classnames";
// ** Custom Components
import Sidebar from "@components/sidebar";
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
import MyCleave from "../../../components/forms/MyCleave";

// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from "reactstrap";

const PatientEditPopup = ({ open, doTogglePopup, recordId, doReloadTable }) => {
  let formSchema = yup.object().shape({
    record_number: yup.string().max(255).notRequired().label("RecordNumber"),
    first_name: yup.string().max(120).notRequired().label("FirstName"),
    middle_name: yup.string().max(120).notRequired().label("MiddleName"),
    last_name: yup.string().max(120).notRequired().label("LastName"),
    second_last_name: yup
      .string()
      .max(120)
      .notRequired()
      .label("SecondLastName"),
    date_of_birth: yup.string().max(20).notRequired().label("DateOfBirth"),
    address: yup.string().max(250).notRequired().label("Address"),
    address1: yup.string().max(250).notRequired().label("Address1"),
    city: yup.string().max(120).notRequired().label("City"),
    country: yup.string().max(120).notRequired().label("Country"),
    zip_code: yup.string().max(120).notRequired().label("ZipCode"),
    fax: yup.string().max(120).notRequired().label("Fax"),
    phone: yup.string().max(120).notRequired().label("Phone"),
    email: yup.string().max(120).notRequired().label("Email"),
    insurance_number: yup
      .string()
      .max(20)
      .notRequired()
      .label("InsuranceNumber"),
    insurance_group_number: yup
      .string()
      .max(20)
      .notRequired()
      .label("InsuranceGroupNumber"),
    insurance_coverage_date: yup
      .string()
      .max(120)
      .notRequired()
      .label("InsuranceCoverageDate"),
      insurance_company_id: yup
      .number() 
      .notRequired()
      .label("InsuranceCompany"),
    other_insured_name: yup
      .string()
      .max(250)
      .notRequired()
      .label("OtherInsuredName"),
    other_insured_policy_name: yup
      .string()
      .max(250)
      .notRequired()
      .label("OtherInsuredPolicyName"),
    other_insured_policy_number: yup
      .string()
      .max(250)
      .notRequired()
      .label("OtherInsuredPolicyNumber"),
    relationship_to_insured_id: yup
      .number()
      .notRequired()
      .label("RelationshipToInsuredId"),
    insurance_card: yup.string().max(250).notRequired().label("InsuranceCard"),
    pcp: yup.string().max(250).notRequired().label("Pcp"),
    pcp_phone: yup.string().max(20).notRequired().label("PcpPhone"),
    pcp_fax: yup.string().max(20).notRequired().label("PcpFax"),
    pcp_email: yup.string().max(250).notRequired().label("PcpEmail"),
    wcp: yup.string().max(250).notRequired().label("Wcp"),
    wcp_phone: yup.string().max(20).notRequired().label("WcpPhone"),
    wcp_email: yup.string().max(250).notRequired().label("WcpEmail"),
    is_active: yup.bool().notRequired().label("IsActive"),
    contact_name: yup.string().max(255).notRequired().label("ContactName"),
    contact_number: yup.string().max(20).notRequired().label("ContactNumber"),
    signature: yup.bool().notRequired().label("Signature"),
    signature_date: yup.string().notRequired().label("SignatureDate"),
    signature_image: yup.string().max(-1).notRequired().label("SignatureImage"),
    signnature_file: yup.string().max(-1).notRequired().label("SignnatureFile"),
    signature_notify: yup.bool().notRequired().label("SignatureNotify"),
    whf_values: yup.string().max(-1).notRequired().label("WhfValues"),
    whf_score: yup.string().max(-1).notRequired().label("WhfScore"),
    whf_score_msg: yup.string().max(-1).notRequired().label("WhfScoreMsg"),
    whf_score_date: yup.string().notRequired().label("WhfScoreDate"),
    uar_values: yup.number().notRequired().label("UarValues"),
    uar_score: yup.string().max(-1).notRequired().label("UarScore"),
    uar_score_msg: yup.string().max(-1).notRequired().label("UarScoreMsg"),
    uar_score_date: yup.string().notRequired().label("UarScoreDate"),
    social_security_number: yup
      .number()
      .notRequired()
      .label("SocialSecurityNumber"),
    alert_no_soc: yup.bool().notRequired().label("AlertNoSoc"),
    other_number: yup.string().max(255).notRequired().label("OtherNumber"),
    other_name: yup.string().max(255).notRequired().label("OtherName"),
    gender_id: yup.number().notRequired().label("GenderId"),
    state_id: yup.number().notRequired().label("StateId"),
    language_id: yup.number().notRequired().label("LanguageId"),
    insurance_category_id: yup
      .number()
      .notRequired()
      .label("InsuranceCategoryId"),
    is_long_term_patient: yup.bool().notRequired().label("IsLongTermPatient"),
    location_id: yup.number().notRequired().label("LocationId"),
    clinic_id: yup.number().notRequired().label("ClinicId"),
  });

  // ** States
  //const [productTypes, setproductTypes] = useState([{ label: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  React.useEffect(() => {
    if (recordId != "" && recordId !== 0) {
      doTogglePopup();
      setLoading(true);

      useApi
        .get(`/patients/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("record_number", data.record_number);
          setValue("first_name", data.first_name);
          setValue("middle_name", data.middle_name);
          setValue("last_name", data.last_name);
          setValue("second_last_name", data.second_last_name);
          setValue("date_of_birth", data.date_of_birth);
          setValue("address", data.address);
          setValue("address1", data.address1);
          setValue("city", data.city);
          setValue("country", data.country);
          setValue("zip_code", data.zip_code);
          setValue("fax", data.fax);
          setValue("phone", data.phone);
          setValue("email", data.email);
          setValue("insurance_number", data.insurance_number);
          setValue("insurance_group_number", data.insurance_group_number);
          setValue("insurance_coverage_date", data.insurance_coverage_date);
          setValue("insurance_company_id", data.insurance_company_id);
          setValue("other_insured_name", data.other_insured_name);
          setValue("other_insured_policy_name", data.other_insured_policy_name);
          setValue(
            "other_insured_policy_number",
            data.other_insured_policy_number
          );
          setValue(
            "relationship_to_insured_id",
            data.relationship_to_insured_id
          );
          setValue("insurance_card", data.insurance_card);
          setValue("pcp", data.pcp);
          setValue("pcp_phone", data.pcp_phone);
          setValue("pcp_fax", data.pcp_fax);
          setValue("pcp_email", data.pcp_email);
          setValue("wcp", data.wcp);
          setValue("wcp_phone", data.wcp_phone);
          setValue("wcp_email", data.wcp_email);
          setValue("is_active", data.is_active);
          setValue("contact_name", data.contact_name);
          setValue("contact_number", data.contact_number);
          setValue("signature", data.signature);
          setValue("signature_date", data.signature_date);
          setValue("signature_image", data.signature_image);
          setValue("signnature_file", data.signnature_file);
          setValue("signature_notify", data.signature_notify);
          setValue("whf_values", data.whf_values);
          setValue("whf_score", data.whf_score);
          setValue("whf_score_msg", data.whf_score_msg);
          setValue("whf_score_date", data.whf_score_date);
          setValue("uar_values", data.uar_values);
          setValue("uar_score", data.uar_score);
          setValue("uar_score_msg", data.uar_score_msg);
          setValue("uar_score_date", data.uar_score_date);
          setValue("social_security_number", data.social_security_number);
          setValue("alert_no_soc", data.alert_no_soc);
          setValue("other_number", data.other_number);
          setValue("other_name", data.other_name);
          setValue("gender_id", data.gender_id);
          setValue("state_id", data.state_id);
          setValue("language_id", data.language_id);
          setValue("insurance_category_id", data.insurance_category_id);
          setValue("is_long_term_patient", data.is_long_term_patient);
          setValue("location_id", data.location_id);
          setValue("clinic_id", data.clinic_id);

          setLoading(false);
        })
        .catch((err) => {
          showAlertError(err);
          setLoading(false);
        });
    }
  }, [recordId]);

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setLoading(true);
    useApi
      .doRun(
        recordId > 0 ? "put" : "post",
        recordId > 0 ? `/patients/${recordId}` : `/patients/-1`,
        {
          id: parseInt(recordId),
          record_number: data.record_number,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          date_of_birth: data.date_of_birth,
          address: data.address,
          address1: data.address1,
          city: data.city,
          country: data.country,
          zip_code: data.zip_code,
          fax: data.fax,
          phone: data.phone,
          email: data.email,
          insurance_number: data.insurance_number,
          insurance_group_number: data.insurance_group_number,
          insurance_coverage_date: data.insurance_coverage_date,
          insurance_company_id: data.insurance_company_id,
          other_insured_name: data.other_insured_name,
          other_insured_policy_name: data.other_insured_policy_name,
          other_insured_policy_number: data.other_insured_policy_number,
          relationship_to_insured_id: data.relationship_to_insured_id,
          insurance_card: data.insurance_card,
          pcp: data.pcp,
          pcp_phone: data.pcp_phone,
          pcp_fax: data.pcp_fax,
          pcp_email: data.pcp_email,
          wcp: data.wcp,
          wcp_phone: data.wcp_phone,
          wcp_email: data.wcp_email,
          is_active: data.is_active,
          contact_name: data.contact_name,
          contact_number: data.contact_number,
          signature: data.signature,
          signature_date: data.signature_date,
          signature_image: data.signature_image,
          signnature_file: data.signnature_file,
          signature_notify: data.signature_notify,
          whf_values: data.whf_values,
          whf_score: data.whf_score,
          whf_score_msg: data.whf_score_msg,
          whf_score_date: data.whf_score_date,
          uar_values: data.uar_values,
          uar_score: data.uar_score,
          uar_score_msg: data.uar_score_msg,
          uar_score_date: data.uar_score_date,
          social_security_number: data.social_security_number,
          alert_no_soc: data.alert_no_soc,
          other_number: data.other_number,
          other_name: data.other_name,
          gender_id: data.gender_id,
          state_id: data.state_id,
          language_id: data.language_id,
          insurance_category_id: data.insurance_category_id,
          is_long_term_patient: data.is_long_term_patient,
          location_id: data.location_id,
          clinic_id: data.clinic_id,
        }
      )
      .then((res) => {
        toast("Patient Updated Successfully!");
        setLoading(false);
        doReloadTable();
      })
      .catch((err) => {
        setLoading(false);
        showAlertError(err);
      });
  };

  const handleSidebarClosed = () => {
    reset({
      record_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      date_of_birth: "",
      address: "",
      address1: "",
      city: "",
      country: "",
      zip_code: "",
      fax: "",
      phone: "",
      email: "",
      insurance_number: "",
      insurance_group_number: "",
      insurance_coverage_date: "",
      insurance_company_id: "",
      other_insured_name: "",
      other_insured_policy_name: "",
      other_insured_policy_number: "",
      relationship_to_insured_id: "",
      insurance_card: "",
      pcp: "",
      pcp_phone: "",
      pcp_fax: "",
      pcp_email: "",
      wcp: "",
      wcp_phone: "",
      wcp_email: "",
      is_active: "",
      contact_name: "",
      contact_number: "",
      signature: "",
      signature_date: "",
      signature_image: "",
      signnature_file: "",
      signature_notify: "",
      whf_values: "",
      whf_score: "",
      whf_score_msg: "",
      whf_score_date: "",
      uar_values: "",
      uar_score: "",
      uar_score_msg: "",
      uar_score_date: "",
      social_security_number: "",
      alert_no_soc: "",
      other_number: "",
      other_name: "",
      gender_id: "",
      state_id: "",
      language_id: "",
      insurance_category_id: "",
      is_long_term_patient: "",
      location_id: "",
      clinic_id: "",
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Patient"
      headerClassName="mb-1"
      contentClassName="pt-0"
      doTogglePopup={doTogglePopup}
      onClosed={handleSidebarClosed}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="record_number">
              Record_number
            </Label>

            <Controller
              id="record_number"
              name="record_number"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.record_number && true} {...field} />
              )}
            />
            {errors.record_number && (
              <FormFeedback>{errors.record_number.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="first_name">
              First_name
            </Label>

            <Controller
              id="first_name"
              name="first_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.first_name && true} {...field} />
              )}
            />
            {errors.first_name && (
              <FormFeedback>{errors.first_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="middle_name">
              Middle_name
            </Label>

            <Controller
              id="middle_name"
              name="middle_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.middle_name && true} {...field} />
              )}
            />
            {errors.middle_name && (
              <FormFeedback>{errors.middle_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="last_name">
              Last_name
            </Label>

            <Controller
              id="last_name"
              name="last_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.last_name && true} {...field} />
              )}
            />
            {errors.last_name && (
              <FormFeedback>{errors.last_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="second_last_name">
              Second_last_name
            </Label>

            <Controller
              id="second_last_name"
              name="second_last_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.second_last_name && true} {...field} />
              )}
            />
            {errors.second_last_name && (
              <FormFeedback>{errors.second_last_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="date_of_birth">
              Date_of_birth
            </Label>

            <Controller
              id="date_of_birth"
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.date_of_birth && true} {...field} />
              )}
            />
            {errors.date_of_birth && (
              <FormFeedback>{errors.date_of_birth.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="address">
              Address
            </Label>

            <Controller
              id="address"
              name="address"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.address && true} {...field} />
              )}
            />
            {errors.address && (
              <FormFeedback>{errors.address.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="address1">
              Address1
            </Label>

            <Controller
              id="address1"
              name="address1"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.address1 && true} {...field} />
              )}
            />
            {errors.address1 && (
              <FormFeedback>{errors.address1.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="city">
              City
            </Label>

            <Controller
              id="city"
              name="city"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.city && true} {...field} />
              )}
            />
            {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="country">
              Country
            </Label>

            <Controller
              id="country"
              name="country"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.country && true} {...field} />
              )}
            />
            {errors.country && (
              <FormFeedback>{errors.country.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="zip_code">
              Zip_code
            </Label>

            <Controller
              id="zip_code"
              name="zip_code"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.zip_code && true} {...field} />
              )}
            />
            {errors.zip_code && (
              <FormFeedback>{errors.zip_code.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="fax">
              Fax
            </Label>

            <Controller
              id="fax"
              name="fax"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.fax && true} {...field} />
              )}
            />
            {errors.fax && <FormFeedback>{errors.fax.message}</FormFeedback>}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="phone">
              Phone
            </Label>

            <Controller
              id="phone"
              name="phone"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.phone && true} {...field} />
              )}
            />
            {errors.phone && (
              <FormFeedback>{errors.phone.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="email">
              Email
            </Label>

            <Controller
              id="email"
              name="email"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.email && true} {...field} />
              )}
            />
            {errors.email && (
              <FormFeedback>{errors.email.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="insurance_number">
              Insurance_number
            </Label>

            <Controller
              id="insurance_number"
              name="insurance_number"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.insurance_number && true} {...field} />
              )}
            />
            {errors.insurance_number && (
              <FormFeedback>{errors.insurance_number.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="insurance_group_number">
              Insurance_group_number
            </Label>

            <Controller
              id="insurance_group_number"
              name="insurance_group_number"
              control={control}
              render={({ field }) => (
                <Input
                  invalid={errors.insurance_group_number && true}
                  {...field}
                />
              )}
            />
            {errors.insurance_group_number && (
              <FormFeedback>
                {errors.insurance_group_number.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="insurance_coverage_date">
              Insurance_coverage_date
            </Label>

            <Controller
              id="insurance_coverage_date"
              name="insurance_coverage_date"
              control={control}
              render={({ field }) => (
                <Input
                  invalid={errors.insurance_coverage_date && true}
                  {...field}
                />
              )}
            />
            {errors.insurance_coverage_date && (
              <FormFeedback>
                {errors.insurance_coverage_date.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="insurance_company_id">
              Insurance_company
            </Label>

            <Controller
              id="insurance_company_id"
              name="insurance_company_id"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.insurance_company_id && true} {...field} />
              )}
            />
            {errors.insurance_company_id && (
              <FormFeedback>{errors.insurance_company_id.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="other_insured_name">
              Other_insured_name
            </Label>

            <Controller
              id="other_insured_name"
              name="other_insured_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.other_insured_name && true} {...field} />
              )}
            />
            {errors.other_insured_name && (
              <FormFeedback>{errors.other_insured_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="other_insured_policy_name">
              Other_insured_policy_name
            </Label>

            <Controller
              id="other_insured_policy_name"
              name="other_insured_policy_name"
              control={control}
              render={({ field }) => (
                <Input
                  invalid={errors.other_insured_policy_name && true}
                  {...field}
                />
              )}
            />
            {errors.other_insured_policy_name && (
              <FormFeedback>
                {errors.other_insured_policy_name.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="other_insured_policy_number">
              Other_insured_policy_number
            </Label>

            <Controller
              id="other_insured_policy_number"
              name="other_insured_policy_number"
              control={control}
              render={({ field }) => (
                <Input
                  invalid={errors.other_insured_policy_number && true}
                  {...field}
                />
              )}
            />
            {errors.other_insured_policy_number && (
              <FormFeedback>
                {errors.other_insured_policy_number.message}
              </FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="relationship_to_insured_id">
              Relationship_to_insured_id
            </Label>

            <Controller
              id="relationship_to_insured_id"
              name="relationship_to_insured_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.relationship_to_insured_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.relationship_to_insured_id && (
              <FormFeedback>
                {errors.relationship_to_insured_id.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="insurance_card">
              Insurance_card
            </Label>

            <Controller
              id="insurance_card"
              name="insurance_card"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.insurance_card && true} {...field} />
              )}
            />
            {errors.insurance_card && (
              <FormFeedback>{errors.insurance_card.message}</FormFeedback>
            )}
          </div>
          

          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="is_active"
                name="is_active"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.is_active && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />
              <Label className="form-label" for="is_active">
                Is_active
              </Label>
              {errors.is_active && (
                <FormFeedback>{errors.is_active.message}</FormFeedback>
              )}
            </div>
          </div>
         
          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="signature"
                name="signature"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.signature && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />
              <Label className="form-label" for="signature">
                Signature
              </Label>
              {errors.signature && (
                <FormFeedback>{errors.signature.message}</FormFeedback>
              )}
            </div>
          </div>

          <div className="mb-1">
            <Label className="form-label" for="signature_date">
              Signature_date
            </Label>

            <Controller
              id="signature_date"
              name="signature_date"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.signature_date && true} {...field} />
              )}
            />
            {errors.signature_date && (
              <FormFeedback>{errors.signature_date.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="signature_image">
              Signature_image
            </Label>

            <Controller
              id="signature_image"
              name="signature_image"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.signature_image && true} {...field} />
              )}
            />
            {errors.signature_image && (
              <FormFeedback>{errors.signature_image.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="signnature_file">
              Signnature_file
            </Label>

            <Controller
              id="signnature_file"
              name="signnature_file"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.signnature_file && true} {...field} />
              )}
            />
            {errors.signnature_file && (
              <FormFeedback>{errors.signnature_file.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="signature_notify"
                name="signature_notify"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.signature_notify && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />
              <Label className="form-label" for="signature_notify">
                Signature_notify
              </Label>
              {errors.signature_notify && (
                <FormFeedback>{errors.signature_notify.message}</FormFeedback>
              )}
            </div>
          </div>
          <div className="mb-1">
            <Label className="form-label" for="whf_values">
              Whf_values
            </Label>

            <Controller
              id="whf_values"
              name="whf_values"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.whf_values && true} {...field} />
              )}
            />
            {errors.whf_values && (
              <FormFeedback>{errors.whf_values.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="whf_score">
              Whf_score
            </Label>

            <Controller
              id="whf_score"
              name="whf_score"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.whf_score && true} {...field} />
              )}
            />
            {errors.whf_score && (
              <FormFeedback>{errors.whf_score.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="whf_score_msg">
              Whf_score_msg
            </Label>

            <Controller
              id="whf_score_msg"
              name="whf_score_msg"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.whf_score_msg && true} {...field} />
              )}
            />
            {errors.whf_score_msg && (
              <FormFeedback>{errors.whf_score_msg.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="whf_score_date">
              Whf_score_date
            </Label>

            <Controller
              id="whf_score_date"
              name="whf_score_date"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.whf_score_date && true} {...field} />
              )}
            />
            {errors.whf_score_date && (
              <FormFeedback>{errors.whf_score_date.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="uar_values">
              Uar_values
            </Label>

            <Controller
              id="uar_values"
              name="uar_values"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.uar_values && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.uar_values && (
              <FormFeedback>{errors.uar_values.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="uar_score">
              Uar_score
            </Label>

            <Controller
              id="uar_score"
              name="uar_score"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.uar_score && true} {...field} />
              )}
            />
            {errors.uar_score && (
              <FormFeedback>{errors.uar_score.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="uar_score_msg">
              Uar_score_msg
            </Label>

            <Controller
              id="uar_score_msg"
              name="uar_score_msg"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.uar_score_msg && true} {...field} />
              )}
            />
            {errors.uar_score_msg && (
              <FormFeedback>{errors.uar_score_msg.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="uar_score_date">
              Uar_score_date
            </Label>

            <Controller
              id="uar_score_date"
              name="uar_score_date"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.uar_score_date && true} {...field} />
              )}
            />
            {errors.uar_score_date && (
              <FormFeedback>{errors.uar_score_date.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="social_security_number">
              Social_security_number
            </Label>

            <Controller
              id="social_security_number"
              name="social_security_number"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.social_security_number && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.social_security_number && (
              <FormFeedback>
                {errors.social_security_number.message}
              </FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="alert_no_soc"
                name="alert_no_soc"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.alert_no_soc && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />
              <Label className="form-label" for="alert_no_soc">
                Alert_no_soc
              </Label>
              {errors.alert_no_soc && (
                <FormFeedback>{errors.alert_no_soc.message}</FormFeedback>
              )}
            </div>
          </div>
          

          <div className="mb-1">
            <Label className="form-label" for="gender_id">
              Gender_id
            </Label>

            <Controller
              id="gender_id"
              name="gender_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.gender_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.gender_id && (
              <FormFeedback>{errors.gender_id.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="state_id">
              State_id
            </Label>

            <Controller
              id="state_id"
              name="state_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.state_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.state_id && (
              <FormFeedback>{errors.state_id.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="language_id">
              Language_id
            </Label>

            <Controller
              id="language_id"
              name="language_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.language_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.language_id && (
              <FormFeedback>{errors.language_id.message}</FormFeedback>
            )}
          </div>

       

          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="is_long_term_patient"
                name="is_long_term_patient"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.is_long_term_patient && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />
              <Label className="form-label" for="is_long_term_patient">
                Is_long_term_patient
              </Label>
              {errors.is_long_term_patient && (
                <FormFeedback>
                  {errors.is_long_term_patient.message}
                </FormFeedback>
              )}
            </div>
          </div>

          <div className="mb-1">
            <Label className="form-label" for="location_id">
              Location_id
            </Label>

            <Controller
              id="location_id"
              name="location_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.location_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.location_id && (
              <FormFeedback>{errors.location_id.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="clinic_id">
              Clinic_id
            </Label>

            <Controller
              id="clinic_id"
              name="clinic_id"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.clinic_id && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.clinic_id && (
              <FormFeedback>{errors.clinic_id.message}</FormFeedback>
            )}
          </div>

          <Button type="submit" className="me-1" color="primary">
            Submit
          </Button>
          <Button
            type="reset"
            color="secondary"
            outline
            onClick={doTogglePopup}
          >
            Cancel
          </Button>
        </Form>
      </UILoader>
    </Sidebar>
  );
};

export default PatientEditPopup;
