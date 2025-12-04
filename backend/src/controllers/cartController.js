import Cart from "../models/Cart.js";
import Toy from "../models/Toy.js";

export const addToCart = async (req, res) => {
    const { toyId, quantity } = req.body;
    const userId = req.user.id;
console.log("ADD TO CART BODY:", req.body);
console.log("USER:", req.user);

    try {
        let cart = await Cart.findOne({ userId });

        const toy = await Toy.findById(toyId);
        if (!toy) return res.status(404).json({ msg: "Toy not found" });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        toyId,
                        quantity,
                        priceAtTheMoment: toy.price,
                    },
                ],
            });

            return res.status(201).json(cart);
        }

        const existingItem = cart.items.find(
            (i) => i.toyId.toString() === toyId.toString()
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                toyId,
                quantity,
                priceAtTheMoment: toy.price,
            });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate(
            "items.toyId"
        );

        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

export const removeItem = async (req, res) => {
    try {
        const { toyId } = req.params;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        cart.items = cart.items.filter(
            (i) => i.toyId.toString() !== toyId.toString()
        );

        await cart.save();

        // Ponovo uzmi cart sa populate pre slanja
        cart = await Cart.findOne({ userId: req.user.id })
            .populate("items.toyId");

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

export const changeQuantity = async (req, res) => {
    try {
        const { toyId } = req.params;
        const { change } = req.body; // +1 ili -1

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        const item = cart.items.find(i => i.toyId.toString() === toyId);

        if (!item) return res.status(404).json({ msg: "Item not found" });

        item.quantity += change;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.toyId.toString() !== toyId);
        }

        await cart.save();

        cart = await Cart.findOne({ userId: req.user.id }).populate("items.toyId");

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

