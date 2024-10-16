import "./TextHighlightFormatPopup.scss";

type TextHighlightFormatPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  handleOnClickOption: (option: string) => void;
};

export default function TextHighlightFormatPopup(
  props: Readonly<TextHighlightFormatPopupProps>
) {
  const { isOpen, onClose, handleOnClickOption } = props;

  return (
    isOpen && (
      <div>
        <button className="shade" onClick={onClose} />
        <div className="popup">
          <p className="popup-header">Zin opsplitsen</p>
          <div className="popup-body">
            <button
              className="popup-btn-option"
              onClick={() => handleOnClickOption("letter")}
            >
              <p className="title">A</p>
              <p className="description">Per letter</p>
            </button>
            <button
              className="popup-btn-option"
              onClick={() => handleOnClickOption("word")}
            >
              <p className="title">ABC</p>
              <p className="description">Per woord</p>
            </button>
          </div>
          <div className="popup-footer">
            <button className="popup-btn-cancel" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </div>
      </div>
    )
  );
}
