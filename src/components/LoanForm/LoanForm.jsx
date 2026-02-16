import { useEffect, useState } from "react";
import {
  getLoanProducts,
  getValidationRules,
  checkEligibility,
} from "../../api/loanApi";
import { validateField } from "../../utils/validators";

const LoadingDots = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex space-x-3 mb-4">
          <div className="w-4 h-4 bg-blue-700 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-red-600 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-blue-700 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-4 h-4 bg-red-600 rounded animate-bounce" style={{ animationDelay: '450ms' }}></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Processing your application...</p>
      </div>
    </div>
  );
};




function LoanForm() {
  const [rules, setRules] = useState({});
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      age: "",
      employmentStatus: "",
      employmentDuration: "",
    },
    financialInfo: {
      monthlyIncome: "",
      monthlyExpenses: "",
      existingDebt: "",
      creditScore: "",
    },
    loanDetails: {
      requestedAmount: "",
      loanTerm: "",
      loanPurpose: "",
    },
  });

  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);


  // Load validation rules + products
  useEffect(() => {
    const loadData = async () => {
      const validationData = await getValidationRules();
      setRules(validationData);

      const productData = await getLoanProducts();
      setProducts(productData.products);
    };

    loadData();
  }, []);

  const handleChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((section) => {
      Object.keys(formData[section]).forEach((field) => {
        const rule = rules[section]?.[field];
        const value = formData[section][field];

        const error = validateField(value, rule);

        if (error) {
          if (!newErrors[section]) newErrors[section] = {};
          newErrors[section][field] = error;
        }
      });
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const response = await checkEligibility(formData);
        setResult(response);
      } catch (error) {
        console.error("Eligibility check failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full ">
      {loading && <LoadingDots />}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center ">
          Loan Application Form
        </h2>

        {/* AGE */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            value={formData.personalInfo.age}
            onChange={(e) =>
              handleChange("personalInfo", "age", e.target.value)
            }
            className={`w-full border p-2 rounded ${
              errors.personalInfo?.age
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.personalInfo?.age && (
            <p className="text-red-500 text-sm mt-1">
              {errors.personalInfo.age}
            </p>
          )}
        </div>

        {/* EMPLOYMENT STATUS */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Employment Status
          </label>
          <select
            value={formData.personalInfo.employmentStatus}
            onChange={(e) =>
              handleChange(
                "personalInfo",
                "employmentStatus",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.personalInfo?.employmentStatus
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select status</option>
            {rules.personalInfo?.employmentStatus?.options?.map(
              (option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              )
            )}
          </select>
          {errors.personalInfo?.employmentStatus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.personalInfo.employmentStatus}
            </p>
          )}
        </div>

        {/* EMPLOYMENT DURATION */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Employment Duration (Months)
          </label>
          <input
            type="number"
            value={formData.personalInfo.employmentDuration}
            onChange={(e) =>
              handleChange(
                "personalInfo",
                "employmentDuration",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.personalInfo?.employmentDuration
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.personalInfo?.employmentDuration && (
            <p className="text-red-500 text-sm mt-1">
              {errors.personalInfo.employmentDuration}
            </p>
          )}
        </div>

        {/* MONTHLY INCOME */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Monthly Income (R)
          </label>
          <input
            type="number"
            value={formData.financialInfo.monthlyIncome}
            onChange={(e) =>
              handleChange(
                "financialInfo",
                "monthlyIncome",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.financialInfo?.monthlyIncome
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.financialInfo?.monthlyIncome && (
            <p className="text-red-500 text-sm mt-1">
              {errors.financialInfo.monthlyIncome}
            </p>
          )}
        </div>

        {/* MONTHLY EXPENSES */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Monthly Expenses (R)
          </label>
          <input
            type="number"
            value={formData.financialInfo.monthlyExpenses}
            onChange={(e) =>
              handleChange(
                "financialInfo",
                "monthlyExpenses",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.financialInfo?.monthlyExpenses
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.financialInfo?.monthlyExpenses && (
            <p className="text-red-500 text-sm mt-1">
              {errors.financialInfo.monthlyExpenses}
            </p>
          )}
        </div>

        {/* EXISTING DEBT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Existing Debt (R)
          </label>
          <input
            type="number"
            value={formData.financialInfo.existingDebt}
            onChange={(e) =>
              handleChange(
                "financialInfo",
                "existingDebt",
                e.target.value
              )
            }
            className="w-full border p-2 rounded border-gray-300"
          />
        </div>

        {/* CREDIT SCORE */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Credit Score
          </label>
          <input
            type="number"
            value={formData.financialInfo.creditScore}
            onChange={(e) =>
              handleChange(
                "financialInfo",
                "creditScore",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.financialInfo?.creditScore
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.financialInfo?.creditScore && (
            <p className="text-red-500 text-sm mt-1">
              {errors.financialInfo.creditScore}
            </p>
          )}
        </div>

        {/* REQUESTED AMOUNT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Requested Loan Amount (R)
          </label>
          <input
            type="number"
            value={formData.loanDetails.requestedAmount}
            onChange={(e) =>
              handleChange(
                "loanDetails",
                "requestedAmount",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.loanDetails?.requestedAmount
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.loanDetails?.requestedAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.loanDetails.requestedAmount}
            </p>
          )}
        </div>

        {/* LOAN TERM */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Loan Term (Months)
          </label>
          <input
            type="number"
            value={formData.loanDetails.loanTerm}
            onChange={(e) =>
              handleChange(
                "loanDetails",
                "loanTerm",
                e.target.value
              )
            }
            className={`w-full border p-2 rounded ${
              errors.loanDetails?.loanTerm
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.loanDetails?.loanTerm && (
            <p className="text-red-500 text-sm mt-1">
              {errors.loanDetails.loanTerm}
            </p>
          )}
        </div>

        {/* LOAN PURPOSE */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Loan Purpose
          </label>
          <select
            value={formData.loanDetails.loanPurpose}
            onChange={(e) =>
              handleChange(
                "loanDetails",
                "loanPurpose",
                e.target.value
              )
            }
            className="w-full border p-2 rounded border-gray-300"
          >
            <option value="">Select purpose</option>
            {products.flatMap((product) =>
              product.purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose.replace("_", " ")}
                </option>
              ))
            )}
          </select>
        </div>

            <div className="flex justify-center">
        <button
          onClick={() => {
            setResult(null);
            setErrors({});
            }}
            className="mt-4 bg-[#417ef0] text-white px-4 py-2 rounded-xl"
            >
            {loading ? "Processing..." : "Submit Application"}  
        </button>
        </div>

      </form>

      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded shadow">
          <h3 className="text-xl font-bold mb-4">
            Eligibility Result
          </h3>

          <p>
            Status:
            <span
              className={`ml-2 font-semibold ${
                result.eligibilityResult.isEligible
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {result.eligibilityResult.isEligible
                ? "Approved"
                : "Declined"}
            </span>
          </p>

          <p>
            Risk Category:
            <span className="ml-2 font-semibold capitalize">
              {result.eligibilityResult.riskCategory}
            </span>
          </p>

        <div className="mt-3">
            <p className="font-medium mb-1">
                Approval Likelihood
            </p>

            <div className="w-full bg-gray-200 rounded h-3">
                <div
                className="bg-green-500 h-3 rounded"
                style={{
                    width: `${result.eligibilityResult.approvalLikelihood}%`,
                }}
                />
            </div>

            <p className="text-sm mt-1">
                {result.eligibilityResult.approvalLikelihood}%
            </p>

            <p className="text-sm mt-1">
                {formatCurrency(result.recommendedLoan.maxAmount)}
            </p>
            </div>

        </div>
      )}
    </div>
  );
}

export default LoanForm;
