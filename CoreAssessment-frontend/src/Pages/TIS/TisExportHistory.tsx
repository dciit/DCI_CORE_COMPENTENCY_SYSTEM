import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import SearchIcon from "@mui/icons-material/Search";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getCourseCode, getTISRecord } from "../../service/Tis";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { TISPayload } from "../../Model/TIS/TIS";

type TISResult = {
  code: string;
  tfullname: string;
  fullname: string;
  grpot: string;
  join: string;
  resign: string;
  posit: string;
  dvcd: string;
  dept: string;
  sT_DT: string;
  enD_DT: string;
  coursE_CODE: string;
  coursE_NAME: string;
  trainerType: string;
  coursE_PER_PERSON: string;
  location: string;
  prD_TIME: string;
  traiN_DAY: string;
  eval: string;
  evaL_SCORE: string;
  totaL_MARK: string;
  haS_TEST: string;
};

function TisExportHistory() {
  const [course, setCourse] = useState<string[]>([]);
  const [courseFilter, setCourseFilter] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState<string>("ALL");

  const [data, setdata] = useState<TISResult[]>([]);
  const [count, setcount] = useState<number>(0);
  const [date, setdate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [loadApi, setloadApi] = useState<Boolean>(false);

  const [open, setOpen] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);


  useEffect(() => {
    initData(date);
    initDataCourse();
  }, []);

  async function initDataCourse() {
    let tempDept: any = await getCourseCode();
    setCourse(tempDept);
    setCourseFilter(tempDept);
  }

  async function initData(date: any) {
    setloadApi(true);

    let payload : TISPayload =  {
      stDate: dayjs(date.startDate).format("YYYY-MM-DD"),
      enDate: dayjs(date.endDate).format("YYYY-MM-DD"),
      courseCode: inputValue
    }

    let tempDept: any = await getTISRecord(payload);
    setdata(tempDept);
    setloadApi(false);
  }

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: "TIS" + "_" + new Date().toLocaleString(),
  });

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<TISResult>[]>(
    () => [
      {
        accessorKey: "code",
        header: "CODE",
        size: 1,
      },
      {
        accessorKey: "tfullname",
        header: "TFULLNAME",
        size: 100,
      },
      {
        accessorKey: "fullname",
        header: "FULLNAME",
        size: 20,
      },
      {
        accessorKey: "grpot",
        header: "GRPOT",
        size: 20,
      },
      {
        accessorKey: "join",
        header: "JOIN",
        size: 20,
      },
      {
        accessorKey: "resign",
        header: "RESIGN",
        size: 20,
      },
      {
        accessorKey: "posit",
        header: "POSIT",
        size: 20,
      },
      {
        accessorKey: "dvcd",
        header: "DVCD",
        size: 20,
      },
      {
        accessorKey: "dept",
        header: "DEPT",
        size: 20,
      },
      {
        accessorKey: "sT_DT",
        header: "ST_DT",
        size: 20,
      },
      {
        accessorKey: "enD_DT",
        header: "END_DT",
        size: 20,
      },
      {
        accessorKey: "coursE_CODE",
        header: "COURSE_CODE",
        size: 20,
      },
      {
        accessorKey: "coursE_NAME",
        header: "COURSE_NAME",
        size: 20,
      },
      {
        accessorKey: "trainerType",
        header: "TrainerType",
        size: 20,
      },
      {
        accessorKey: "coursE_PER_PERSON",
        header: "COURSE_PER_PERSON",
        size: 20,
      },
      {
        accessorKey: "location",
        header: "LOCATION",
        size: 20,
      },
      {
        accessorKey: "prD_TIME",
        header: "PRD_TIME",
        size: 20,
      },
      {
        accessorKey: "traiN_DAY",
        header: "TRAIN_DAY",
        size: 20,
      },
      {
        accessorKey: "eval",
        header: "EVAL",
        size: 20,
      },
      {
        accessorKey: "evaL_SCORE",
        header: "EVAL_SCORE",
        size: 20,
      },
      {
        accessorKey: "totaL_MARK",
        header: "TOTAL_MARK",
        size: 20,
      },
      {
        accessorKey: "haS_TEST",
        header: "HAS_TEST",
        size: 20,
      },
    ],
    []
  );



  const table = useMaterialReactTable({
    columns,
    data,
    enableRowNumbers: true,
    paginationDisplayMode: "pages",

    initialState: {
      density: "compact",
      pagination: { pageSize: 15, pageIndex: 0 },
    },
    //@ts-ignore
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{ backgroundColor: "green" }}
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
      >
        Export
      </Button>
    ),
  });

  function handleSelect(ranges: any) {
    setcount(count + 1);
    setdate(ranges.selection);

    if (count == 1) {
      setcount(0);
      setOpen(false);
    }
  }

  const handleOptionClick = (option:string) => {
    setInputValue(option)
    setCourseFilter([]);
    
  }

  const handleInputChange = (e:any) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = course.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setCourseFilter(filtered);
    } else {
      setCourseFilter(course);
    }
  };

  const clickOpenCourse = () => {
    setOpen(false);
    setOpenCourse(true);
  }


  const clickOpenDatePicker = () => {
    setOpen(true);
    setOpenCourse(false);
  }

  return (
    <>
      <div className="flex flex-col justify-start items-start content-center p-4 gap-10 ">
    
        <div className="flex flex-row  gap-3 mt-6 ">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Start Date.
            </label>
            <div className="relative rounded-md">
              <input
                type="text"
                readOnly
                value={dayjs(date.startDate).format("DD/MM/YYYY")}
                onClick={clickOpenDatePicker}

                className="block w-full bg-[#faffb3] rounded-md border-0 py-3 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-8">-</div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              End Date.
            </label>
            <div className="relative rounded-md ">
              <input
                type="text"
                readOnly
                value={dayjs(date.endDate).format("DD/MM/YYYY")}
                onClick={clickOpenDatePicker}

                className="block bg-[#faffb3] w-full rounded-md border-0 py-3 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="relative inline-block w-64 mt-6 ">
              <div className="relative rounded-md ">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onClick={clickOpenCourse}
                  className="block bg-[#faffb3] w-full rounded-md border-0 py-3 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
                />
              </div>
              {(courseFilter.length  > 0 &&  openCourse) && (
                <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto w-full z-10">
                  {courseFilter.map((option, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => initData(date)}
              type="button"
              className="text-white bg-indigo-500 hover:bg-indigo-700 hover:scale-110 hover:-translate-y-1 transition-all duration-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        {open && <DateRangePicker ranges={[date]} onChange={handleSelect} />}
        {loadApi ? (
          <>
            <div className="w-[100%]">
              <Skeleton variant="rounded" height={700} />
            </div>
          </>
        ) : (
          <>
            <div className="w-full">
              <MaterialReactTable table={table} />
            </div>
          </>
        )}
      </div>
      
    </>
  );
}

export default TisExportHistory;
