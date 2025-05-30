# Core Compentency System (ระบบประเมินสมรรถนะพนักงาน) / ComplianceCourse TrainingRecord

![image](https://github.com/user-attachments/assets/60cf7f49-ab33-4e80-961f-1e34f011a66d) &nbsp; ![image](https://github.com/user-attachments/assets/5cdda449-645c-4b8c-b433-c1c0df4d93f3)



## กระบวนการทำงาน (Flowchart)

![image](https://github.com/user-attachments/assets/c2cc9011-0f78-45d4-afdc-24c930994115)


![image](https://github.com/user-attachments/assets/5b86e676-2413-4bd3-a467-d5af58b86ee7)



## How to install project
1) git clone project
- **Backend**
  - 2.1) open visual studio
  - 2.2) run
- **Frontend**
  - 3.1) cd open project
  - 3.2) npm install
  - 3.3) npm run dev


# Database Table (costy/192.168.226.145)
- **TR_CompetenctAssessment_DEV => เก็บข้อมูลการบันทึกการประเมินและอนุมัติของพนักงาน**
- **TR_CompetenctAssessmentDetail_DEV => เก็บข้อมูลรายละเอียดการบันทึกการประเมินแต่ละหัวข้อ (comment)**
- **TR_CompentencyREV => Master จัดการรอบเวลาการประเมิน**  <br/>
- **TR_CompentencyApproveFlow => Master จัดการ Role/permissions ในการประเมินและอนุมัติของ  supervisor , manager , gm**

## หน้าการประเมิน
- **TR_Indicator_Main => Master จัดการช่องการแสดงชื่อหัวข้อการประเมิน ผูกกับ course การอบรม และ core level**
- **TR_Indicator => Master จัดการช่องการแสดงชื่อหัวข้อย่อยการประเมิน**
- **TR_KPI => Master จัดการช่องการแสดง SKILL** 

## จัดการ Department , section , group
- **HRD_DEPT**
- **HRD_SECT**
- **HRD_GRP** 

## จัดการอื่นๆ
- **DictMstr => ชื่อย่อของ ตำแหน่ง,ชื่อย่อของแผนก**



