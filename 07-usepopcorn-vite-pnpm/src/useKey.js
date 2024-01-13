import { useEffect } from "react";

export function useKey(keyName, onKey){

  useEffect(
    /// listen for document keyup event to close movie details on ESC
    function () {
      function handleKeyup(e) {
        // console.log('keyup', e);

        if (e.key.toLowerCase() === keyName.toLowerCase()) {
          onKey();
        }
      }
      console.log('✅ useKey add key:', keyName);
      document.addEventListener('keyup', handleKeyup);

      return function () {
        console.log('❌ useKey cleanup: ',keyName)
        document.removeEventListener('keyup', handleKeyup);
      };
    },
    [keyName, onKey]
  );
}