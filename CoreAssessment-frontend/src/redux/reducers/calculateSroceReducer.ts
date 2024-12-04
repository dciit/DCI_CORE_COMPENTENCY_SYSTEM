const initialData = {
  yourScoreStatus: {
    yourChoiceSelect: [],
    // yourScore: 0,
    // yourPercent: 0,
    yourChocie: 0,
    yourTotalChoice: 0,
    // perviousScore: 0,
    // countInput: 0,
  },
};

const calculateSroceReducer = (state = initialData, action: any) => {
  switch (action.type) {
    case "CHOICE_NEW_SELECT":
      return {
        ...state,
        yourScoreStatus: {
          yourChoiceSelect: [
            ...state.yourScoreStatus.yourChoiceSelect,
            action.payload.yourChoiceSelect,
          ],
          // perviousScore:state.yourScoreStatus.yourScore,
          //yourScore:state.yourScoreStatus.yourScore + parseInt(action.payload.yourScore),
          yourChocie: state.yourScoreStatus.yourChocie + 1,
          //countInput : state.yourScoreStatus.countInput + 1,
        },
      };

    case "CHOICE_CURRENT_SELECT":
      return {
        ...state,
        yourScoreStatus: {
          yourChoiceSelect: [...state.yourScoreStatus.yourChoiceSelect],
          //perviousScore: parseInt(action.payload.yourScore),
          // yourScore:state.yourScoreStatus.yourScore - parseInt(action.payload.yourScoreChoiceSelect) ,
          yourChocie: state.yourScoreStatus.yourChocie,
          // countInput : state.yourScoreStatus.countInput,
        },
      };

    case "LOAD_SELECT":
      return {
        ...state,
        yourScoreStatus: {
          yourChoiceSelect: [...state.yourScoreStatus.yourChoiceSelect],
          //perviousScore: action.payload.perviousScore ,
          yourChocie: action.payload.yourChocie,
          // yourScore:action.payload.yourScore,
          // countInput : state.yourScoreStatus.countInput,
        },
      };

    case "RESET_CALCULATE":
      return {
        yourScoreStatus: {
          yourChoiceSelect: [],
          yourScore: 0,
          perviousScore: 0,
          // yourPercent:(state.yourScoreStatus.yourScore * 100) / action.payload.yourTotalChoice,
          yourChocie: 0,
          countInput: 0,
        },
      };

    default:
      return state;
  }
};

export default calculateSroceReducer;
