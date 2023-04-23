import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';


const Recipe = () => {
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [ingredientsOnHand, setIngredientsOnHand] = useState('');
  const [cuisinePreference, setCuisinePreference] = useState('');
  const [recipe, setRecipe] = useState({});
  const [inputText, setInputText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `Generate a recipe for ${dietaryPreference} using ${ingredientsOnHand} and with ${cuisinePreference} cuisine. List out the Ingredients required in "Ingredients:", Instructions in "Instructions:", title in "Title:" and nutrition values in "Nutrition"`,
        model: 'text-davinci-003',
        max_tokens: 1024,
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });
      const recipeText = response.data.choices[0].text.trim();
      // const recipeText = "\n\nTitle: French Omelette\n\nIngredients:\n2 eggs\n4 tablespoons of all-purpose flour\n1/4 cup of milk\n1 tablespoon of butter\nPinch of salt\n\nInstructions:\n1. In a small bowl, beat eggs until light and fluffy.\n2. Add the flour and stir until blended.\n3. Slowly stir in the milk until the mixture is smooth.\n4. Heat a non-stick skillet over medium-high heat and add the butter.\n5. Once the butter has melted, pour in the egg mixture and tilt the pan to spread the mixture evenly.\n6. Sprinkle the salt onto the omelette and cook until the edges are light golden brown.\n7. Gently turn over the omelette with a spatula and cook for another minute or two.\n8. Slide the omelette onto a plate and serve."
      const title = recipeText.match(/Title:(.*)Ingredients:/s)[1].trim();
      const ingredients = recipeText.match(/Ingredients:(.*)Instructions:/s)[1].trim()
      const instructions = recipeText.match(/Instructions:(.*)Nutrition:/s)[1].trim()
      const nutritions = recipeText.match(/Nutrition:(.*)/s)[1].trim()
      const recipe = {title, ingredients, instructions, nutritions};
      setRecipe(recipe);
      setInputText(title);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if(inputText) {
      generateImage(inputText);
    }
  }, [inputText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const generateImage = () => {

    fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorisation": `Bearer ${process.env.REACT_APP_HUGGING_FACE}`
        },
        body: JSON.stringify({ inputs: inputText }),
      }
    )
      .then((res) => res.blob())
      .then((blob) => {
        setGeneratedImage(URL.createObjectURL(blob));
        // setRecipes([...recipes, {recipes[recipes.length-1]][generatedImage]: generatedImage});
        setRecipe({...recipe, generatedImage});
        setLoading(false);
      });
  };
  

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} className='form-container'>
            <Form.Group controlId="dietaryPreference">
              <Form.Label>Dietary Preferences</Form.Label>
              <Form.Select value={dietaryPreference} onChange={(event) => setDietaryPreference(event.target.value)}>
                <option>Select One</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="nonvegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="vegetarian">Ketogenic</option>
                <option value="vegetarian">Low-Carb</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="ingredientsOnHand">
              <Form.Label>Ingredients on Hand</Form.Label>
              <Form.Control type="text" placeholder="Enter ingredients separated by commas" value={ingredientsOnHand} onChange={(event) => setIngredientsOnHand(event.target.value)} />
            </Form.Group>
            <Form.Group controlId="cuisinePreference">
              <Form.Label>Cuisine Preferences</Form.Label>
              <Form.Select value={cuisinePreference} onChange={(event) => setCuisinePreference(event.target.value)}>
                <option>Select One</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="indian">Indian</option>
                <option value="chinese">Chinese</option>
                <option value="french">French</option>
                <option value="japanese">Japanese</option>
                <option value="thai">Thai</option>
                <option value="greek">Greek</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="spanish">Spanish</option>
                <option value="middle-eastern">Middle Eastern</option>
                <option value="korean">Korean</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" style={{ fontSize: "16px", fontWeight: "bold", marginTop: "20px" }} >Generate Recipe</Button>
          </Form>
        </Col>
      </Row>
      {loading && <div className="recipe-container">
        {<Spinner animation="border" role="status"></Spinner>}
      </div>}
      {(generatedImage && !loading) && <div className="recipe-container">
        <div className="recipe-title">{recipe.title.trim()}</div><div className="image-container">
          <img src={generatedImage} alt="Generated" />
        </div><div className="ingredients">
            <h5>Ingredients:</h5>
            <p>
              {recipe.ingredients.split('\n').filter(i => i.trim() !== '').map(i => <li>{i.trim().replace('-', '')}</li>)}
            </p>
          </div>
          <div className="instructions">
            <h5>Cooking instructions:</h5>
            <p>
              {recipe.instructions.split('\n').filter(i => i.trim() !== '').map(i => <li>{i.trim()}</li>)}
            </p>
          </div>
          <div className="instructions">
            <h5>Nutrition:</h5>
            <p>
              {recipe.nutritions.split('\n').filter(i => i.trim() !== '').map(i => <li>{i.trim()}</li>)}
            </p>
          </div>
      </div>}
    </Container>
  );
};

export default Recipe;
