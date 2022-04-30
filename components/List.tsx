//Session-12
import "./List.css";
import Item from "./Item";
import { StoryType } from "../types";

type ListProps = {
  listOfItems: Array<StoryType>;
  onClickDelete: (e: number) => void;
};

const List = ({ listOfItems, onClickDelete }: ListProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Author</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listOfItems.map((item) => (
            <Item
              key={item.objectID}
              item={item}
              onClickDelete={onClickDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
//Session-11
/*import "./List.css";

const List = ({ listOfItems }: any) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Author</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {listOfItems.map((item: any) => (
            <tr key={item.objectID}>
              <td className="itemTitle">{item.title}</td>
              <td className="itemUrl">{item.url}</td>
              <td>{item.author}</td>
              <td>{item.num_comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;*/