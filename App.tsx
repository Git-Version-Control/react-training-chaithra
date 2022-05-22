import styles from "./App.module.css";
import List from "./components/List";
import InputWithLabel from "./components/InputWithLabel";
import logo from "./assets/logo.png";
import usePersistence from "./hooks/usePersistence";
import React, {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  createContext,
} from "react";
import axios from "axios";
import { useDebounce } from "./hooks/useDebounce";
import { StateType, StoryType, ActionType } from "./types";
import { Link } from "react-router-dom";
import Pagination from "./components/Pagination";

export const title: string = "React Training";

export function storiesReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case "SET_STORIES":
      return { data: action.payload.data, isError: false, isLoading: false };
    case "INIT_FETCH":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_STORY":
      const filteredState = state.data.filter(
        (story: any) => story.objectID !== action.payload.id
      );
      return { data: filteredState, isError: false, isLoading: false };
    default:
      return state;
  }
}

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?hitsPerPage=10&query=";
//const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?hitsPerPage=10&page=";
//const API_ENDPOINT_PAGE = "https://hn.algolia.com/api/v1/search?page=";
interface AppContextType {
  onClickDelete: (e: number) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

function App(): JSX.Element {
  const [searchText, setSearchText] = usePersistence("searchTerm", "React");
  const debouncedUrl = useDebounce(API_ENDPOINT + searchText);
  //let debouncedUrl = useDebounce(API_ENDPOINT + searchText);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isError: false,
    isLoading: false,
  });
  //const[post,setPosts]=useState([]);
  const[currentPage, setCurrentPage]=useState(1);
  const[itemPerPage, setItemPerPage]=useState(20);

  const sumOfComments = useMemo(
    () =>
      stories.data.reduce(
        (acc: number, current: StoryType) => acc + current.num_comments,
        0
      ),
    [stories]
  );

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "INIT_FETCH" });
    try {
      const response = await axios.get(debouncedUrl);
      //setItemPerPage(response.data);
      //setSearchText(response.data);
      //setPosts(response.data)
      dispatchStories({
        type: "SET_STORIES",
        payload: { data: response.data.hits },
      });
      
    } catch {
      dispatchStories({ type: "FETCH_FAILURE" });
    }
  }, [debouncedUrl]);
  console.log(stories.data.length);
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  const handleDeleteClick = useCallback((objectId: number) => {
    console.log("Delete click captured", objectId);
    dispatchStories({ type: "REMOVE_STORY", payload: { id: objectId } });
    setItemPerPage(prevCount=>prevCount-1);
  }, []);

  /*function  handlePagination(){
    debouncedUrl = useDebounce(API_ENDPOINT_PAGE + paginate);
  }*/

  if (stories.isError) {
    return (
      <h1 style={{ marginTop: "10rem", color: " red" }}>
        Something went wrong
      </h1>
    );
  }
  
  const indexOfLastPage=currentPage* itemPerPage;
  const indexOfFirstPage=indexOfLastPage-itemPerPage;
  //console.log(indexOfFirstPage, indexOfLastPage);
  const paginate =( pageNumber: React.SetStateAction<number>):any => setCurrentPage(pageNumber);
  //const currentPageList=searchText.slice(indexOfFirstPage,indexOfLastPage);

  return (
    <div>
      <nav>
        <div className={styles.heading}>
          <h1>{title}</h1>
          <img src={logo} />
        </div>
        <p>Sum: {sumOfComments}</p>
        <InputWithLabel
          searchText={searchText}
          onChange={handleChange}
          id="searchBox"
        >
          Search
        </InputWithLabel>
        <Link to="/login" state={{ id: "1234" }}>
          <h6>Login</h6>
        </Link>
        <Pagination itemPerPage={itemPerPage} totalPosts={100} paginate={paginate}/>
      </nav>
      {stories.isLoading ? (
        <h1 style={{ marginTop: "10rem" }}>Loading</h1>
      ) : (
        <AppContext.Provider value={{ onClickDelete: handleDeleteClick }}>          
          <List listOfItems={stories.data} />
        </AppContext.Provider>
      )}
     {/*<Pagination itemPerPage={itemPerPage} totalPosts={100} onClick={handlePagination()}/>*/ }
     {}
    </div>
  );
}

export default App;