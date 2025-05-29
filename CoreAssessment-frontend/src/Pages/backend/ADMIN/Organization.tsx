import React, { useEffect, useState } from 'react';
import { DashboardFilled, DownOutlined, HomeFilled } from '@ant-design/icons';
import { Select, Switch,Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { CarryOutOutlined, CheckOutlined, FormOutlined } from '@ant-design/icons';
import { getOrganization } from '../../../service/admin';
import { DataNode } from 'antd/es/tree';
import PersonIcon from '@mui/icons-material/Person';





function Organization() {

  const [organizations, setorganizations] = React.useState<TreeDataNode[]>([])
  const [loadAPI, setloadAPI] = useState<Boolean>(true);


  useEffect(() => {
    
    initLoadData()
    
  }, [])


  const initLoadData = async() => {
    try {
      const res : any = await getOrganization();
      const mappedData = mapTreeData(res);
      setorganizations(mappedData)
      setloadAPI(false);
  
   
    } catch (error) {
      console.error('Error fetching organization tree:', error);
      return []; 
    }
  }

  const mapTreeData = (nodes: TreeDataNode[]): DataNode[] => {
    return nodes.map((node) => ({
      title: ' ' + node.title,
      key: node.key,
      icon: (node.title?.toString().includes('Section') || node.title?.toString().includes('Department') 
               || node.title?.toString().includes('Group'))  ? 
               <HomeFilled className='text-blue-500'/> : <PersonIcon className='text-green-500'/>,
      children: node.children ? mapTreeData(node.children) : undefined
    }));
  };



  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };




  return (
    <>
  
      {/* {loadAPI ? (
           <div
                    className="flex flex-col justify-center items-center h-screen w-screen gap-5 bg-slate-300"
                   > 
                   <div> <CircularProgress size={60}/></div>
                   <div> <p className="text-2xl"> กําลังโหลด ....</p></div>
                    
                   
                   </div>
          ) : <div className="hs-accordion-treeview-root" role="tree" aria-orientation="vertical">
          <div className="hs-accordion-group" role="group" data-hs-accordion-always-open="">
        
            <div className="hs-accordion" role="treeitem" aria-expanded="false" id="hs-basic-usage-example-tree-heading-two">
              <div className="hs-accordion-heading py-0.5 flex items-center gap-x-0.5 w-full">
                <button className="hs-accordion-toggle size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-expanded="false" aria-controls="hs-basic-usage-example-tree-collapse-two">
                  <svg className="size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path className="hs-accordion-active:hidden block" d="M12 5v14"></path>
                  </svg>
                </button>
        
                <div className="grow hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-1.5 rounded-md cursor-pointer">
                  <div className="flex items-center gap-x-3">
                    <svg className="shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                    <div className="grow">
                      <span className="text-sm text-gray-800 dark:text-neutral-200">
                        scripts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
        
              <div id="hs-basic-usage-example-tree-collapse-two" className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="group" aria-labelledby="hs-basic-usage-example-tree-heading-two">
                <div className="ms-3 ps-3 relative before:absolute before:top-0 before:start-0 before:w-0.5 before:-ms-px before:h-full before:bg-gray-100 dark:before:bg-neutral-700">
                  <div className="hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-2 rounded-md cursor-pointer" role="treeitem">
                    <div className="flex items-center gap-x-3">
                      <svg className="shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      </svg>
                      <div className="grow">
                        <span className="text-sm text-gray-800 dark:text-neutral-200">
                          preline.js
                        </span>
                      </div>
                    </div>
                  </div>
        
                  <div className="hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-2 rounded-md cursor-pointer" role="treeitem">
                    <div className="flex items-center gap-x-3">
                      <svg className="shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      </svg>
                      <div className="grow">
                        <span className="text-sm text-gray-800 dark:text-neutral-200">
                          tailwind.js
                        </span>
                      </div>
                    </div>
                  </div>
        
                  <div className="hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-2 rounded-md cursor-pointer" role="treeitem">
                    <div className="flex items-center gap-x-3">
                      <svg className="shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      </svg>
                      <div className="grow">
                        <span className="text-sm text-gray-800 dark:text-neutral-200">
                          www.js
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
          
          </div>
        </div>} */}
       <div>

        <Tree
          className="custom-large-tree text-lg p-6"
          showLine={true}
          showIcon={true}
          onSelect={onSelect}
          treeData={organizations}
        />
    </div>


    
    </>
  )
}

export default Organization




