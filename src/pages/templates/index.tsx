"use client";
import { useState } from "react";
import { renderToString } from "react-dom/server";
const Templates: React.FC = () => {
  const [welcome, setWelcome] = useState("");
  const [unsuccessful, setUnsuccessful] = useState("");
  const [successful, setSuccessful] = useState("");
  const [birthday, setBirthday] = useState("");
  const [special, setSpecial] = useState("");
  const [offline, setOffline] = useState("");
  

  const details = [
    {
      id: "1",
      heading: "Welcome Message:",
      description: (
        <div>
          Dear <span style={{ backgroundColor: "yellow" }}>[custname]</span>,
          congratulations on successfully becoming a member with KUBES!
          We&apos;re thrilled to have you on board. You can avail{" "}
          <span style={{ backgroundColor: "yellow" }}>[discount]</span> for
          dine-in at KUBES. Your membership id is{" "}
          <span style={{ backgroundColor: "yellow" }}>[memberid]</span>. Thank
          you for choosing KUBES! We look forward to serving you soon. Than You,
          KUBES Bot. Success Message: Here&apos;s how to avail your discount:-
          Send your membership ID to KUBES via WhatsApp before requesting the
          bill.- You&apos;ll promptly receive a coupon code (valid until the end
          of the day).- Simply show the coupon code to our staff when settling
          the bill to avail the discount. Reservations:{" "}
          <a href="https://tableagent.com/singapore/kubes-bistro/">
            https://tableagent.com/singapore/kubes-bistro/
          </a>{" "}
          Delivery:{" "}
          <a href="https://kubesdelivery.com/">https://kubesdelivery.com/</a>{" "}
          Website:{" "}
          <a href="https://kubesbistro.com/">https://kubesbistro.com/</a>{" "}
          Contact: 96250331
        </div>
      ),
    },
    {
      id: "2",
      heading: "Unsuccessful Message:",
      description: (
        <div>
          Welcome! This is KUBES membership BOT. To assist you promptly, kindly
          share your KUBES membership ID to start the conversation. For
          assistance, call 96250331. Than You, KUBES Bot. Reservations:
          https://tableagent.com/singapore/kubes-bistro/ Delivery:
          https://kubesdelivery.com/ Website: https://kubesbistro.com/
        </div>
      ),
    },
    {
      id: "3",
      heading: "Successful Message:",
      description: (
        <div>
          Dear <span style={{ backgroundColor: "yellow" }}>[custname]</span>,
          Thank you for dining at KUBES! We appreciate your patronage. Please
          remember to show the coupon code{" "}
          <span style={{ backgroundColor: "yellow" }}>[dailycode]</span> to our
          staff before making your payment. We hope to see you again soon for
          another delightful dining experience! Than You, KUBES Bot.
          Reservations: https://tableagent.com/singapore/kubes-bistro/ Delivery:
          https://kubesdelivery.com/ Website: https://kubesbistro.com/
        </div>
      ),
    },
    {
      id: "4",
      heading: "Birthday Message:",
      description: (
        <div>
          Dear <span style={{ backgroundColor: "yellow" }}>[custname]</span>,
          advanced happy birthday wishes. Celebrate your birthday in KUBES in
          your birthday week and avail{" "}
          <span style={{ backgroundColor: "yellow" }}>
            [basediscount + birthdaydisc]
          </span>{" "}
          We hope to see you again soon for another delightful dining
          experience! Than You, KUBES Bot. Reservations:
          https://tableagent.com/singapore/kubes-bistro/ Delivery:
          https://kubesdelivery.com/ Website: https://kubesbistro.com/
        </div>
      ),
    },
    {
      id: "5",
      heading: "Special Message:",
      description: (
        <div>
          Dear <span style={{ backgroundColor: "yellow" }}>[custname]</span>, to
          celebrate this festive season, KUBES exclusively offers{" "}
          <span style={{ backgroundColor: "yellow" }}>
            [basediscount + birthdaydisc]
          </span>{" "}
          to you! Dine-In at KUBES to celebrate with delightful dining
          experience. Offer valid for the festival week. Than You, KUBES Bot.
          Reservations: https://tableagent.com/singapore/kubes-bistro/ Delivery:
          https://kubesdelivery.com/ Website: https://kubesbistro.com/
        </div>
      ),
    },
    {
      id: "6",
      heading: "Offline Message:",
      description: (
        <div>
          Dear <span style={{ backgroundColor: "yellow" }}>[custname]</span>, we
          are currently offline. Our business hours are as follows, Mon -Fri
          3.30pm to 12mn Sat - Sun 12.30pm to 12mn Thank you for your patience!
          KUBES Bot.
        </div>
      ),
    },
  ];

  const handleChange = (name: string, value: string) => {
    switch (name) {
      case "Welcome Message:":
        setWelcome(value);
        break;
      case "Unsuccessful Message:":
        setUnsuccessful(value);
        break;
      case "Successful Message:":
        setSuccessful(value);
        break;
      case "Birthday Message:":
        setBirthday(value);
        break;
      case "Special Message:":
        setSpecial(value);
        break;
      case "Offline Message:":
        setOffline(value);
        break;
      default:
        break;
    }
  };

  const extractTextContent = (element: JSX.Element): string => {
    if (typeof element === "string") {
      return element;
    }

    if (Array.isArray(element)) {
      return element.map(extractTextContent).join("");
    }

    if (element.props && element.props.children) {
      return extractTextContent(element.props.children);
    }

    return "";
  };

  const handleUseButtonClick = (description: JSX.Element, id: string) => {
    // Extract text content from the JSX element
    const descriptionText = extractTextContent(description);

    // Set the corresponding textarea value when "Use" button is clicked
    switch (id) {
      case "1":
        setWelcome(descriptionText);
        break;
      case "2":
        setUnsuccessful(descriptionText);
        break;
      case "3":
        setSuccessful(descriptionText);
        break;
      case "4":
        setBirthday(descriptionText);
        break;
      case "5":
        setSpecial(descriptionText);
        break;
      case "6":
        setOffline(descriptionText);
        break;
      default:
        break;
    }
  };

  return (
    <div className="overflow-y-scroll h-screen w-[65rem]">
      <div className="mt-10 flex flex-col lg:flex-row w-30 mb-32">
        <div className="w-[90%] lg:w-[65%] xl:w-[55%] mx-4 md:mx-5 bg-white p-3 pt-10 rounded-xl shadow-md">
          {details.map((msg) => (
            <div
              key={msg.id}
              className="flex flex-col md:flex-row justify-between mb-6"
            >
              <h1 className="text-base lg:text-sm xl:text-xl font-bold flex items-center mb-2 md:mb-0">
                {msg.heading}
              </h1>
              <div>
                <textarea
                  value={
                    msg.heading === "Welcome Message:"
                      ? welcome
                      : msg.heading === "Unsuccessful Message:"
                      ? unsuccessful
                      : msg.heading === "Successful Message:"
                      ? successful
                      : msg.heading === "Birthday Message:"
                      ? birthday
                      : msg.heading === "Special Message:"
                      ? special
                      : msg.heading === "Offline Message:"
                      ? offline
                      : ""
                  }
                  className="textarea textarea-bordered border w-full md:w-80 lg:w-[20rem] xl:w-[30rem] h-40 text-sm rounded-lg ml-1 md:ml-0 p-2"
                  onChange={(e) => handleChange(msg.heading, e.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="place-content-center flex mt-8 mb-2">
            <button className="text-white bg-red-100 border-red-100 hover:text-black font-bold p-4 bg-main hover:bg-red-500 rounded-xl">
              Save Changes
            </button>
          </div>
        </div>
        <div className="w-[90%] lg:w-[35%] xl:w-[40%] ml-4 lg:ml-0 mr-0 lg:mr-3 xl:mr-0">
          <div>
            {details.map((msg) => (
              <div
                key={msg.id}
                className="border border-gray-400 p-3 rounded-xl shadow-md mt-5 lg:mt-0 mb-8"
              >
                <h1 className="font-bold text-sm md:text-base">
                  {msg.heading}
                </h1>
                <p className="text-xs mt-2">{msg.description}</p>
                <button
                  onClick={() => handleUseButtonClick(msg.description, msg.id)}
                  className="text-white bg-red-100 border-red-100 hover:text-black font-bold px-8 py-2 bg-main hover:bg-red-500 rounded-xl mt-2"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;