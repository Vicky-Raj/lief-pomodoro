import Modal from "react-modal";
import { Box } from "grommet";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TaskForm = (props: TaskModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      ariaHideApp={false}
      style={{
        overlay:{
          zIndex:2
        },
        content: {
          top: "40%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "500px",
          fontFamily: "Roboto",
          zIndex:100,
          overflowY:"scroll",
          overflowX:"hidden"
        },
      }}
      contentLabel="Example Modal"
    >
      {props.children}
    </Modal>
  );
};

export default TaskForm;
