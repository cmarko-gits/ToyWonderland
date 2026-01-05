import Reservation from "../models/Reservation.js";
import Cart from "../models/Cart.js";
import Toy from "../models/Toy.js";

export const createReservation = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("--- START: CREATE RESERVATION ---");
        console.log("User ID:", userId);

        const cart = await Cart.findOne({ userId }).populate("items.toyId");
        
        if (!cart || !cart.items || cart.items.length === 0) {
            console.log("Output: Cart is empty");
            return res.status(400).json({ msg: "Korpa je prazna." });
        }

        for (const item of cart.items) {
            console.log(`Checking Stock - Toy: ${item.toyId?.name}, Required: ${item.quantity}, Available: ${item.toyId?.inStock}`);
            if (!item.toyId || item.toyId.inStock < item.quantity) {
                console.log("Output: Insufficient stock detected");
                return res.status(400).json({ msg: `Nedovoljno zaliha za jednu ili više igračaka.` });
            }
        }

        const reservationItems = cart.items.map(item => ({
            toy: item.toyId._id,
            quantity: item.quantity,
            price: item.priceAtTheMoment
        }));

        const total = reservationItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        console.log("Updating stock in database...");
        for (const item of cart.items) {
            const idZaUpdate = item.toyId._id || item.toyId;
            const updateResult = await Toy.updateOne(
                { _id: idZaUpdate },
                { $inc: { inStock: -item.quantity } }
            );
            console.log(`Update Output for ${idZaUpdate}:`, updateResult);
        }

        const reservation = await Reservation.create({
            user: userId,
            items: reservationItems,
            total,
            status: "reserved"
        });

        console.log("Reservation created:", reservation._id);

        await Cart.findOneAndDelete({ userId });
        console.log("Output: Cart deleted");
        console.log("--- END: SUCCESS ---");

        res.status(201).json(reservation);

    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

export const getUserReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id })
            .populate("items.toy")
            .sort({ createdAt: -1 });
        console.log(`Output: Found ${reservations.length} reservations for user`);
        res.json(reservations);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate("items.toy")
            .populate("user", "fullName email")
            .sort({ createdAt: -1 });
        console.log(`Output: Admin fetched ${reservations.length} total reservations`);
        res.json(reservations);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { status } = req.body;
        console.log(`--- START: UPDATE STATUS [${req.params.id}] ---`);
        console.log("New Status:", status);

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            console.log("Output: Reservation not found");
            return res.status(404).json({ msg: "Reservation not found" });
        }

        if (status === "canceled" && reservation.status !== "canceled") {
            console.log("Output: Restoring stock for canceled items");
            for (const item of reservation.items) {
                const restoreResult = await Toy.updateOne(
                    { _id: item.toy },
                    { $inc: { inStock: item.quantity } }
                );
                console.log(`Restore Output for Toy ${item.toy}:`, restoreResult);
            }
        }

        reservation.status = status;
        await reservation.save();
        console.log("Output: Status updated successfully");
        console.log("--- END: SUCCESS ---");
        res.json(reservation);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};