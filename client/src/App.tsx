import { FC ,useState} from "react";
import { TextEditor } from "./components/textEditor";

export const App:FC  = () => {
  const [value,setValue] = useState<string>("")
  return (
   
      <>  
         <TextEditor placeholder="Enter text" enteredText={value} onTyping={setValue} />
      </>
    
  );
}

