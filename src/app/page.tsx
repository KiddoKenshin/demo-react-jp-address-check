"use client";
import { useRef, useState } from "react";

export default function Home() {
  const zipCodeRef = useRef();
  const addressRef = useRef();
  const addressRef2 = useRef();
  const handleZipCode = async () => {
    const { current: { value } } = zipCodeRef;
    if (!value.includes("-")) {
      alert("郵便番号は正しくない！");
      return;
    }

    const containsOnlyNumbers = (str: string) => {
      return /^\d+$/.test(str);
    };
    const [zip1, zip2] = value.split("-");
    if (
      zip1.length !== 3 || zip2.length !== 4 || 
      !containsOnlyNumbers(zip1) ||
      !containsOnlyNumbers(zip2))
    {
      alert("郵便番号は正しくない！");
      return;
    }

    const response = await fetch("https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + zip1 + zip2);
    if (!response.ok) {
      alert("API エラー！");
      return;
    }

    const { results: [ data ] } = await response.json();
    if (data) {
      const {address1, address2, address3} = data;
      addressRef.current.value = `${address1 + address2 + address3}`;
    }
  }

  const [ mapQ, setMapQ ] = useState("");
  const handleMap = () => {
    const query = addressRef.current.value + addressRef2.current.value;
    // "AIzaSyCGIs4gDqMRAj3quzbwMV8g4kXYj9_63g0";
    setMapQ(query);
    console.log(mapQ);
  };
  return (
    <main>
      <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <span className="fs-4">Japanese Address / Map Demo</span>
          </div>
        </header>
        <div>
          <div className="input-group mb-3">
            <span className="input-group-text">〒</span>
            <input type="text" className="form-control" maxLength={8} ref={zipCodeRef} required />
            <button className="btn btn-outline-secondary" type="button" onClick={handleZipCode}>住所検索</button>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">住所</span>
            <input type="text" className="form-control" ref={addressRef} disabled />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">町番以降</span>
            <input type="text" className="form-control" ref={addressRef2} />
          </div>
          <button className="btn btn-outline-secondary" onClick={handleMap}>MAP 表示</button>
        </div>
        <div id="map">
          {mapQ && (
            <iframe
              width="640"
              height="480"
              frameBorder="0"
              referrerPolicy="no-referrer-when-downgrade"
              src={ `https://www.google.com/maps/embed/v1/place?key=AIzaSyCGIs4gDqMRAj3quzbwMV8g4kXYj9_63g0&q=${encodeURIComponent(mapQ)}` }
            >
            </iframe>
          )}
        </div>
      </div>
    </main>
  )
}
