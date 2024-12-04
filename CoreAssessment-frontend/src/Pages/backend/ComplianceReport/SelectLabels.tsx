// import * as React from "react";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import { Button, Typography } from "@mui/material";
// import Search from "@mui/icons-material/Search";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "react-beautiful-dnd";

// import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

// const lineObj: any = [{ line: 1 }, { line: 2 }, { line: 3 }];
// const modelObj: any = [
//   { line: 1, model: "line1_1" },
//   { line: 1, model: "line1_2" },
//   { line: 2, model: "line2_1" },
//   { line: 2, model: "line2_2" },
//   { line: 2, model: "line2_3" },
//   { line: 3, model: "line3_1" },
// ];

// const ProcessObj: any = [
//   {
//     model: "line1_1",
//     processDesc: [
//       { processID: 1, ProcessName: "test11" },
//       { processID: 2, ProcessName: "test12" },
//       { processID: 3, ProcessName: "test13" },
//     ],
//   },
//   {
//     model: "line1_2",
//     processDesc: [
//       { processID: 1, ProcessName: "test123" },
//       { processID: 2, ProcessName: "test234" },
//       { processID: 3, ProcessName: "test345" },
//     ],
//   },
//   {
//     model: "line2_1",
//     processDesc: [
//       { processID: 1, ProcessName: "no1" },
//       { processID: 2, ProcessName: "no2" },
//       { processID: 3, ProcessName: "no3" },
//     ],
//   },
//   {
//     model: "line2_2",
//     processDesc: [
//       { processID: 1, ProcessName: "seq1" },
//       { processID: 2, ProcessName: "seq2" },
//       { processID: 3, ProcessName: "seq3" },
//     ],
//   },
//   {
//     model: "line3_1",
//     processDesc: [
//       { processID: 1, ProcessName: "po01" },
//       { processID: 2, ProcessName: "po02" },
//       { processID: 3, ProcessName: "po03" },
//     ],
//   },
// ];

// const initialItems: Item[] = [
//   { id: "item-1", content: "Item 1" },
//   { id: "item-2", content: "Item 2" },
//   { id: "item-3", content: "Item 3" },
//   { id: "item-4", content: "Item 4" },
// ];

// interface Item {
//   id: string;
//   content: string;
// }

// export default function SelectLabels() {
//   //@ts-ignore

//   const listItems = [
//     "Entertainment",
//     "Private Time",
//     "Rest",
//     "Meal",
//     "Exercise",
//     "Work",
//     "Home Projects",
//     "Family",
//   ];

//   const [modelLine, setModelLine] = React.useState([]);
//   const [processData, setprocessData] = React.useState([]);
//   const [line, setline] = React.useState("");
//   const [model, setmodel] = React.useState("");
//   const [isPressed, setIsPressed] = React.useState(false);
//   const [isIndex, setIsindex] = React.useState(0);

//   React.useEffect(() => {
//     const updatedItems = [...items];
//     const [reorderedItem] = updatedItems.splice(2, 1);

//     updatedItems.splice(3, 0, reorderedItem);

//     setItems(updatedItems);
//   }, []);

//   const handleChange = (event: SelectChangeEvent) => {
//     setline(event.target.value);
//   };

//   const [items, setItems] = React.useState<Item[]>(initialItems);

//   const handleChange2 = (event: SelectChangeEvent) => {
//     setmodel(event.target.value);
//   };

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return; // dropped outside the list
//     const updatedItems = [...items];
    
//     const [reorderedItem] = updatedItems.splice(result.source.index, 1);
//     console.log(result.source.index);
  
//     updatedItems.splice(result.destination.index, 0, reorderedItem);
//     console.log(result.destination.index);

//     setItems(updatedItems);
//   };

//   const clickElement = (index: number) => {
//     setIsPressed(isPressed);
//     setIsindex(index);
//   };

//   return (
//     <>
//       {JSON.stringify(items)}
//       <div className="p-20 overflow-hidden">
//         <div className="bg-slate-100 border border-black text-left p-4">
//           <div className="flex justify-start gap-6">
//             <div>
//               <FormControl sx={{ m: 1, minWidth: 120 }}>
//                 <InputLabel id="demo-simple-select-helper-label">
//                   Line
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-helper-label"
//                   id="demo-simple-select-helper"
//                   value={line}
//                   onChange={handleChange}
//                 >
//                   {lineObj.map((item: any, index: any) => (
//                     <MenuItem value={item.line} key={index}>
//                       {item.line}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <FormControl sx={{ m: 1, minWidth: 120 }}>
//                 <InputLabel id="demo-simple-select-helper-label">
//                   Model
//                 </InputLabel>

//                 <Select
//                   value={model}
//                   onChange={handleChange2}
//                   displayEmpty
//                   inputProps={{ "aria-label": "Without label" }}
//                 >
//                   {modelObj
//                     .filter((x: any) => x.line == line)
//                     .map((item: any, index: any) => (
//                       <MenuItem value={item.model} key={index}>
//                         {item.model}
//                       </MenuItem>
//                     ))}
//                 </Select>
//               </FormControl>
//             </div>

//             <div>
//               <Button
//                 type="button"
//                 variant="contained"
//                 color="info"
//                 onClick={() =>
//                   setprocessData(
//                     ProcessObj.filter((x: any) => x.model == model)
//                   )
//                 }
//                 endIcon={<Search className="text-3xl" />}
//                 sx={{ width: 120, height: 54, mt: 1 }}
//               >
//                 <Typography variant="h6" sx={{ color: "white" }}>
//                   ค้นหา
//                 </Typography>
//               </Button>
//             </div>
//           </div>
//         </div>

//         {processData.length > 0 && (
//           <div className="mt-10">
//             {processData.map((item: any, index: any) => (
//               <div>
//                 {item.processDesc.map((item2: any, index2: any) => (
//                   <div>
//                     <p className="p-4 bg-red-200 rounded-lg">
//                       {item2.processID} &nbsp; {item2.ProcessName}
//                     </p>
//                     <br />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         <DragDropContext onDragEnd={handleDragEnd}>
//           <Droppable droppableId="droppable">
//             {(provided: any) => (
//               <div {...provided.droppableProps} ref={provided.innerRef}>
//                 {items.map((item, index) => (
//                   <Draggable key={item.id} draggableId={item.id} index={index}>
//                     {(provided: any) => (
//                       <div className="flex justify-start">
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={{
//                           padding: "10px",
//                           marginBottom: "5px",
//                           marginTop: "20px",
//                           border: "1px solid #ccc",
//                           borderRadius: "4px",
//                           ...provided.draggableProps.style,
//                         }}
//                         className={
//                           isPressed && index == isIndex
//                             ? "bg-sky-700 text-white"
//                             : "bg-white"
//                         }
//                       >
//                         <button
//                           className="text-left curson-pointer"
//                           onClick={() => clickElement(index)}
//                         >
//                           {item.content}
//                         </button>
//                         <div className="text-right">
//                           <Button  endIcon={<ChangeCircleIcon style={{width:'50px',height:'50px'}}/>}>                  
//                           </Button>
//                         </div>
//                       </div>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>
//     </>
//   );
// }
