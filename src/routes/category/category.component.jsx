import { useParams } from 'react-router-dom';
import { CategoriesContext } from '../../contexts/categories.context';
import { useContext, useEffect, useState } from 'react';
import ProductCard from '../../components/products-card/product-card.component';

import './category.styles.scss';

const Category = () => {
	const { category } = useParams();
	const { categoriesMap } = useContext(CategoriesContext);

	// This component rely on asynchronous fetched code i.e. categoriesMap, so we need some safegaurd to only render if we have data
	const [products, setProducts] = useState(categoriesMap[category]);

	useEffect(() => {
		setProducts(categoriesMap[category]);
	}, [categoriesMap, category]);

	return (
		<>
			<h2 className="category-title">{category.toUpperCase()}</h2>
			<div className="category-container">
				{products &&
					products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
			</div>
		</>
	);
};

export default Category;
