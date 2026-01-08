import asyncio
import websockets
import json

positions = ["center", "right", "left", "top", "bottom"]
durations = [5, 5, 5, 5, 4]  # seconds

async def send_positions(websocket):
    for pos, duration in zip(positions, durations):
        message = json.dumps({"position": pos})
        await websocket.send(message)
        print(f"Sent: {message}")
        await asyncio.sleep(duration)

async def handler(websocket):
    print("Client connected")
    await send_positions(websocket)
    print("Finished sending positions")

async def main():
    try:
        async with websockets.serve(handler, "localhost", 8000):
            print("Mock WebSocket server running at ws://localhost:8000")
            await asyncio.Future()  # run forever
    except asyncio.CancelledError:
        print("Server shutdown gracefully.")
        
if __name__ == "__main__":
    asyncio.run(main())
