import { useEffect, useState } from "react";
import { getREVAssessment } from "../../service/coreAssessment";
import { useSelector, useDispatch } from "react-redux";
import Countdown from "react-countdown";
import dayjs from "dayjs";

function RevRound() {
  const dispatch = useDispatch();
  const [Rev, setRev] = useState<string>("");
  const [countDownTime, setcountDownTime] = useState<number>(86400000);
  const [enDate, setenDate] = useState<string>("");
  const [timeOut, settimeOut] = useState<Boolean>(false);
  const timeOutAssessmentEmployee = useSelector(
    (state: any) => state.timeoutCounterStateReducer.timeoutCounterState
  );
  useEffect(() => {
    getRev();
  }, []);

  const getRev = async () => {
    let data: any = await getREVAssessment();
    setRev(data.code);
    setcountDownTime(data.timerCountDown);
    setenDate(data.endDate);
    dispatch({
      type: "GET_REV_AND_TIMEOUT",
      payload: {
        ...timeOutAssessmentEmployee,
        assessmentRev: data.code,
        assessmentTimeout: false,
      },
    });
  };

  const Completionist = () => (
    <div className="text-center">
      <span className="text-3xl text-red-600">หมดเวลาประเมินพนักงาน</span>
    </div>
  );

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed && !timeOutAssessmentEmployee.assessmentTimeout) {
      // Render a completed state
      settimeOut(true);

      dispatch({
        type: "GET_REV_AND_TIMEOUT",
        payload: { ...timeOutAssessmentEmployee, assessmentTimeout: true },
      });

      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <>
          <div className="flex flex-row justify-between gap-[8px]">
            <div>{days} </div>
            <div>วัน</div>
            <div>{hours} </div>
            <div>ชม</div>
            <div>{minutes} </div>
            <div>นาที</div>
            <div className="w-3">{seconds}</div>
            <div>วินาที </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className=" border-2 border-dashed border-orange-500 w-[400px] md:w-full mt-1 mb-2 p-1 rounded-lg bg-yellow-50">
          <div className={!timeOut ? "hidden" : "text-sm text-red-600"}>
            <Completionist />
          </div>

          <div className={timeOut && "hidden"}>
            <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row justify-between p-1">
              <div className="text-start">
                <h1 className="text-xl md:text-lg ">{`รอบการประเมิน ( ${Rev} )`}</h1>
              </div>
              <div className="text-end">
                <div className="flex flex-row justify-between">
                  <div>
                 
                    <h1 className="text-xl md:text-lg">
                      {`กรุณาประเมินก่อนวันที่ : ${dayjs(enDate).format("DD/MM/YYYY")}`} 
                    </h1>
                  </div>
                  <div>
             
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-start gap-5 mt-3 md:mt-0 md:gap-[35px]">
              <div>
                <h1 className="text-sm text-center md:text-sm text-red-600 font-medium	"></h1>{" "}
              </div>
              <div className="flex flex-row  gap-[20px] md:gap-2 hidden">
                <div className={timeOut && "hidden"}>
                  <img
                    src="https://www.itgenius.co.th/assets/frondend/images/icon/util/icons-clock.gif"
                    alt=""
                    className="h-8 w-8 "
                  />
                </div>
                <div className="grow text-end text-sm md:text-sm   text-red-600 font-light">
                  <Countdown
                    date={Date.now() + countDownTime}
                    renderer={renderer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RevRound;
