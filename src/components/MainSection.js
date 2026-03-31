import React, { useState, useEffect } from "react";

function MainSection() {
    const [featuredFlavors, setFeaturedFlavors] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/flavors")
            .then((res) => res.json())
            .then((data) => {
                const shuffled = [...data.flavors].sort(() => 0.5 - Math.random());
                setFeaturedFlavors(shuffled.slice(0, 3));
            });

        fetch("http://localhost:5000/reviews")
            .then((res) => res.json())
            .then((data) => {
                setReviews(data.reviews);
            });
    }, []);

    function renderStars(rating) {
        var stars = "";
        for (var i = 0; i < 5; i++) {
            if (i < rating) {
                stars += "★";
            } else {
                stars += "☆";
            }
        }
        return stars;
    }

    return (
        <div className="main-section">
            <h2>About Sweet Scoop Ice Cream</h2>
            <p>
                Sweet Scoop Ice Cream is a family-owned business that has been serving
                delicious ice cream since 1990. We pride ourselves on using only the
                freshest ingredients to create our unique flavors. Come visit us and
                treat yourself to a sweet scoop today!
            </p>

            <h2>Featured Flavors</h2>
            <div className="flavor-grid">
                {featuredFlavors.map(function (flavor) {
                    return (
                        <div className="flavor-card" key={flavor.id}>
                            <img src={flavor.image} alt={flavor.name} />
                            <h3>{flavor.name}</h3>
                            <p>{flavor.description}</p>
                            <p>{flavor.price}</p>
                        </div>
                    );
                })}
            </div>

            <h2>Customer Reviews</h2>
            {reviews.map(function (review, index) {
                return (
                    <div key={index}>
                        <h3>{review.customerName}</h3>
                        <p>{renderStars(review.rating)}</p>
                        <p>{review.review}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default MainSection;