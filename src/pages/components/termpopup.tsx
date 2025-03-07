import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface TermsPopupProps {
    open: boolean;
    onClose: () => void;
  }
  
  export default function TermsPopup({ open, onClose }: TermsPopupProps) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>ข้อตกลงการใช้งานปฏิทิน</DialogTitle>
        <DialogContent>
        <p style={{ marginBottom: "16px", fontWeight: "bold" }}>
          กรุณาอ่านและยอมรับข้อตกลงก่อนใช้งานปฏิทินนักศึกษา
        </p>
          <ul style={{ marginBottom: "24px", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            เว็บไซต์นี้จะขอให้คุณใช้อีเมลและรหัสผ่านของนักศึกษา เพื่อเข้าสู่ระบบและเข้าถึงข้อมูลปฏิทินส่วนบุคคลของคุณที่เกี่ยวข้องกับมหาวิทยาลัยเท่านั้น
          </li>
          <li style={{ marginBottom: "8px" }}>
            ข้อมูลส่วนตัวที่คุณให้จะถูกเก็บรักษาอย่างปลอดภัย เป็นความลับ
            และจะถูกใช้เฉพาะเพื่อวัตถุประสงค์ในการแสดงข้อมูลปฏิทินและการจัดการตารางนัดหมายของคุณเท่านั้น
          </li>
          <li style={{ marginBottom: "8px" }}>
            เราจะไม่เปิดเผยหรือส่งต่อข้อมูลส่วนบุคคลของคุณให้กับบุคคลภายนอกหรือบุคคลที่สามใดๆ โดยไม่ได้รับอนุญาตจากคุณ
          </li>
          <li>การใช้งานเว็บไซต์นี้ถือว่าคุณได้อ่านและยอมรับข้อตกลงในการใช้งานข้างต้นทุกประการ</li>
        </ul>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 ,  marginTop: "-30px" }}>
          <Button variant="contained" onClick={onClose} sx={{ backgroundColor: "#5263F3", fontWeight: "bold" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
