const Countries = ({countries, handleClick}) => (
    <div>
      {
      countries.map(country => 
        <div key={country.name.common}>
          {country.name.common} 
          <button onClick={() => handleClick(country.name.common)}>show</button>
        </div>)
      }
    </div>
)

export default Countries