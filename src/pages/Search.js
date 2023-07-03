import { Input as Antinput } from 'antd'

const Search = ({ value, onChange }) => {
  return (
    <form>
      <Antinput
        className='search-input'
        type='text'
        placeholder='Filter'
        value={value}
        onChange={onChange}
      />
    </form>
  );
}

export default Search