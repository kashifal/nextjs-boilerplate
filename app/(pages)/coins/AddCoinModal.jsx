"use client";
import { useState, useEffect } from "react";

const AddCoinModal = ({ onClose, isOpen, editingCoin }) => {
  const [formData, setFormData] = useState({
    name: "",
    walletAddress: "",
    durationDays: 14,
    apy: 12.2,
    durations: [{ duration: "", percentage: "" }],
    qrcode: null,
    logoUrl: null,
    symbol: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [qrcodePreview, setQrcodePreview] = useState(null);
  const [qrcodeFile, setQrcodeFile] = useState(null);

  useEffect(() => {
    if (editingCoin) {
      setFormData({
        ...editingCoin,
        id: editingCoin._id,
        durations: editingCoin.durations || [{ duration: "", percentage: "" }],
        symbol: editingCoin.symbol || "",
      });
      setImagePreview(
        editingCoin.logoUrl
          ? `${process.env.NEXT_PUBLIC_URL}/${editingCoin.logoUrl}`
          : null
      );
      setQrcodePreview(
        editingCoin.qrcode
          ? `${process.env.NEXT_PUBLIC_URL}/${editingCoin.qrcode}`
          : null
      );
    } else {
      setFormData({
        name: "",
        walletAddress: "",
        durationDays: 14,
        apy: 12.2,
        durations: [{ duration: "", percentage: "" }],
        qrcode: null,
        logoUrl: null,
        symbol: "",
      });
      setImagePreview(null);
      setQrcodePreview(null);
    }
  }, [editingCoin]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrcodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrcodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrcodePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDurationChange = (index, field, value) => {
    const newDurations = [...formData.durations];
    newDurations[index] = {
      ...newDurations[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      durations: newDurations,
    }));

    console.log(formData);
    return;
  };

  const addDurationField = () => {
    setFormData((prev) => ({
      ...prev,
      durations: [...prev.durations, { duration: "", percentage: "" }],
    }));
  };

  const removeDurationField = (index) => {
    setFormData((prev) => ({
      ...prev,
      durations: prev.durations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    if (logoFile) formDataToSend.append("logo", logoFile);
    if (qrcodeFile) formDataToSend.append("qrcode", qrcodeFile);

    const method = editingCoin ? "PUT" : "POST";

    try {
      const response = await fetch("/api/coin", {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to save coin");
      }
    } catch (error) {
      console.error("Error saving coin:", error);
    }
  };

  // Update modal title based on whether we're editing or adding
  const modalTitle = editingCoin ? "Edit coin" : "Add new coin";
  const submitButtonText = editingCoin ? "Update coin" : "Create coin";

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target.id === "modalOverlay") onClose();
      }}
      id="modalOverlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white text-[black] rounded-2xl min-w-[480px] p-6 relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{modalTitle}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={onClose}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 1L1 13M1 1L13 13"
                stroke="#8D8D8D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 flex">
          <div>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Coin logo preview"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <svg
                width={64}
                height={64}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width={64} height={64} rx={32} fill="#E2E4E9" />
                <g filter="url(#filter0_i_2005_633)">
                  <g clipPath="url(#clip0_2005_633)">
                    <rect width={64} height={64} rx={32} fill="#E2E4E9" />
                    <g filter="url(#filter1_di_2005_633)">
                      <ellipse
                        cx={32}
                        cy="60.8001"
                        rx="25.6"
                        ry="19.2"
                        fill="url(#paint0_radial_2005_633)"
                        shapeRendering="crispEdges"
                      />
                      <path
                        d="M57.1 60.8001C57.1 65.9094 54.3399 70.5731 49.802 73.9766C45.2638 77.3801 38.9715 79.5001 32 79.5001C25.0285 79.5001 18.7362 77.3801 14.1981 73.9766C9.66011 70.5731 6.90002 65.9094 6.90002 60.8001C6.90002 55.6908 9.66011 51.0271 14.1981 47.6236C18.7362 44.2201 25.0285 42.1001 32 42.1001C38.9715 42.1001 45.2638 44.2201 49.802 47.6236C54.3399 51.0271 57.1 55.6908 57.1 60.8001Z"
                        stroke="url(#paint1_radial_2005_633)"
                        shapeRendering="crispEdges"
                      />
                    </g>
                    <g filter="url(#filter2_di_2005_633)">
                      <circle
                        cx={32}
                        cy="25.5998"
                        r="12.8"
                        fill="url(#paint2_radial_2005_633)"
                        shapeRendering="crispEdges"
                      />
                      <circle
                        cx={32}
                        cy="25.5998"
                        r="12.3"
                        stroke="url(#paint3_radial_2005_633)"
                        shapeRendering="crispEdges"
                      />
                    </g>
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter0_i_2005_633"
                    x={0}
                    y={-8}
                    width={64}
                    height={72}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={-8} />
                    <feGaussianBlur stdDeviation={8} />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2={-1}
                      k3={1}
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.7712 0 0 0 0 0.78 0 0 0 0 0.7888 0 0 0 0.48 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_2005_633"
                    />
                  </filter>
                  <filter
                    id="filter1_di_2005_633"
                    x="2.40002"
                    y="33.6001"
                    width="59.2"
                    height="54.3999"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.541176 0 0 0 0 0.560784 0 0 0 0 0.576471 0 0 0 0.16 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2005_633"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2005_633"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={-8} />
                    <feGaussianBlur stdDeviation={4} />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2={-1}
                      k3={1}
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect2_innerShadow_2005_633"
                    />
                  </filter>
                  <filter
                    id="filter2_di_2005_633"
                    x="15.2"
                    y="4.7998"
                    width="33.6"
                    height="41.6001"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.541176 0 0 0 0 0.560784 0 0 0 0 0.576471 0 0 0 0.16 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2005_633"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2005_633"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy={-8} />
                    <feGaussianBlur stdDeviation={4} />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2={-1}
                      k3={1}
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect2_innerShadow_2005_633"
                    />
                  </filter>
                  <radialGradient
                    id="paint0_radial_2005_633"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(32 41.6001) rotate(90) scale(38.4 51.2)"
                  >
                    <stop stop-color="white" />
                    <stop offset={1} stop-color="white" stopOpacity={0} />
                  </radialGradient>
                  <radialGradient
                    id="paint1_radial_2005_633"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(32 41.6001) rotate(90) scale(38.4 51.2)"
                  >
                    <stop stop-color="white" />
                    <stop offset={1} stop-color="white" stopOpacity={0} />
                  </radialGradient>
                  <radialGradient
                    id="paint2_radial_2005_633"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(32 12.7998) rotate(90) scale(25.6)"
                  >
                    <stop stop-color="white" />
                    <stop offset={1} stop-color="white" stopOpacity={0} />
                  </radialGradient>
                  <radialGradient
                    id="paint3_radial_2005_633"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(32 12.7998) rotate(90) scale(25.6)"
                  >
                    <stop stop-color="white" />
                    <stop offset={1} stop-color="white" stopOpacity={0} />
                  </radialGradient>
                  <clipPath id="clip0_2005_633">
                    <rect width={64} height={64} rx={32} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
          <div className="ml-[10px]">
            <p className="font-medium text-sm mb-1">Coin Logo</p>
            <p className="text-xs text-gray-500 mb-2">
              Min 400x400px, PNG, JPEG or SVG
            </p>
            <div className="flex items-center">
              <input
                type="file"
                id="logoUpload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => document.getElementById("logoUpload").click()}
                className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex">
          <div>
            {qrcodePreview ? (
              <img
                src={qrcodePreview}
                alt="QR code preview"
                className="w-16 h-16 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H9V9H3V3Z"
                    stroke="#8D8D8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 3H21V9H15V3Z"
                    stroke="#8D8D8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 15H9V21H3V15Z"
                    stroke="#8D8D8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 15H21V21H15V15Z"
                    stroke="#8D8D8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="ml-[10px]">
            <p className="font-medium text-sm mb-1">QR Code</p>
            <p className="text-xs text-gray-500 mb-2">PNG or JPEG format</p>
            <div className="flex items-center">
              <input
                type="file"
                id="qrcodeUpload"
                className="hidden"
                accept="image/*"
                onChange={handleQrcodeUpload}
              />
              <button
                type="button"
                onClick={() => document.getElementById("qrcodeUpload").click()}
                className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Coin name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder="Enter symbol (e.g., BTC)"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Wallet address
            </label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          {formData.durations.map((duration, index) => (
            <div key={index} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration.duration}
                    onChange={(e) =>
                      handleDurationChange(index, "duration", e.target.value)
                    }
                    placeholder="Enter duration"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Percentage
                  </label>
                  <input
                    type="text"
                    value={duration.percentage}
                    onChange={(e) =>
                      handleDurationChange(index, "percentage", e.target.value)
                    }
                    placeholder="Enter percentage"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDurationField(index)}
                  className="absolute right-0 top-0 p-0"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3.25H15.441C14.54 3.25 14.502 3.136 14.255 2.396L14.053 1.789C13.746 0.869001 12.889 0.25 11.919 0.25H8.08099C7.11099 0.25 6.253 0.868001 5.947 1.789L5.745 2.396C5.498 3.137 5.46 3.25 4.559 3.25H1C0.586 3.25 0.25 3.586 0.25 4C0.25 4.414 0.586 4.75 1 4.75H2.298L3.065 16.249C3.213 18.474 4.57701 19.75 6.80701 19.75H13.194C15.423 19.75 16.787 18.474 16.936 16.249L17.703 4.75H19C19.414 4.75 19.75 4.414 19.75 4C19.75 3.586 19.414 3.25 19 3.25Z"
                      fill="#AFAFAF"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addDurationField}
            className="w-full flex items-center justify-center space-x-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.33334V12.6667"
                stroke="#8D8D8D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.33334 8H12.6667"
                stroke="#8D8D8D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-600">Add field</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-[#00FF29] text-black rounded-lg hover:bg-[#00E025] transition-colors text-sm font-medium"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default AddCoinModal;
