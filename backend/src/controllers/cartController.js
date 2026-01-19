import Cart from "../models/Cart.js";
import Toy from "../models/Toy.js";

export const addToCart = async (req, res) => {
    const { toyId, quantity } = req.body;
    const userId = req.user.id;

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
            // BITNO: I ovde mora populate pre slanja!
            const newPopulatedCart = await Cart.findById(cart._id).populate("items.toyId");
            return res.status(201).json(newPopulatedCart);
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
        
        // Finalno osvežavanje sa svim podacima o igračkama
        const populatedCart = await Cart.findOne({ userId }).populate("items.toyId");
        res.json(populatedCart);
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
        const { change } = req.body;

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

